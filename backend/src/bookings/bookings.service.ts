import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HoldRoomDto, SubmitBookingDto, CalculatePriceDto } from './dto/booking.dto';
import { PaginationQueryDto, buildPaginationMeta } from '../common/dto/pagination.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async checkAvailability(roomId: string, checkIn: Date, checkOut: Date, guests: number, roomQuantity: number = 1): Promise<boolean> {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new BadRequestException('Room not found');
    if ((room.capacity * roomQuantity) < guests) throw new BadRequestException('Room capacity is not enough');

    // Count overlapping confirmed/pending bookings
    const overlapping = await this.prisma.booking.aggregate({
      _sum: { roomQuantity: true },
      where: {
        roomId,
        status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
        OR: [
          { checkIn: { lt: checkOut }, checkOut: { gt: checkIn } }
        ]
      }
    });

    const bookedRooms = overlapping._sum?.roomQuantity || 0;
    
    return (room.quantity - bookedRooms) >= roomQuantity;
  }

  async holdRoom(data: HoldRoomDto) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    if (checkIn >= checkOut) throw new BadRequestException('Check-out must be after check-in');
    
    const roomQuantity = data.roomQuantity || 1;
    const isAvailable = await this.checkAvailability(data.roomId, checkIn, checkOut, data.guests, roomQuantity);
    if (!isAvailable) throw new BadRequestException('Room is not available for these dates or quantity');

    const holdId = uuidv4();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.cacheManager.set(`hold:${holdId}`, {
      ...data,
      roomQuantity,
      expiresAt,
    }, 10 * 60 * 1000); // 10 mins TTL

    return { holdId, expiresAt };
  }

  async calculatePrice(data: CalculatePriceDto) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    if (checkIn >= checkOut) throw new BadRequestException('Check-out must be after check-in');

    const room = await this.prisma.room.findUnique({ where: { id: data.roomId }, include: { hotel: true } });
    if (!room) throw new BadRequestException('Room not found');

    const pricingRules = await this.prisma.pricingRule.findMany({
      where: { hotelId: room.hotelId }
    });

    const roomQuantity = data.roomQuantity || 1;
    let basePriceTotal = 0;
    let surgeTotal = 0;

    // Loop through each night
    let currentDate = new Date(checkIn);
    while (currentDate < checkOut) {
      let nightPrice = room.basePrice * roomQuantity;
      let nightSurge = 0;

      // Apply rules (simplified, takes first matching rule)
      const dayOfWeek = currentDate.getDay();
      const rule = pricingRules.find(r => 
        (r.dayOfWeek === null || r.dayOfWeek === dayOfWeek) &&
        (!r.startDate || r.startDate <= currentDate) &&
        (!r.endDate || r.endDate >= currentDate)
      );

      if (rule) {
        if (rule.multiplier) nightSurge += (nightPrice * rule.multiplier) - nightPrice;
        if (rule.flatFee) nightSurge += (rule.flatFee * roomQuantity);
      }

      basePriceTotal += nightPrice;
      surgeTotal += nightSurge;
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let discountAmount = 0;
    if (data.discountCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: data.discountCode } });
      if (coupon && (!coupon.expiryDate || coupon.expiryDate > new Date())) {
        const subtotal = basePriceTotal + surgeTotal;
        if (!coupon.minSpend || subtotal >= coupon.minSpend) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = subtotal * (coupon.amount / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.amount;
          }
        }
      }
    }

    return {
      basePrice: basePriceTotal,
      seasonalSurge: surgeTotal,
      discountAmount,
      totalAmount: Math.max(0, basePriceTotal + surgeTotal - discountAmount)
    };
  }

  async submitBooking(userId: string, data: SubmitBookingDto) {
    const holdData = await this.cacheManager.get(`hold:${data.holdId}`) as any;
    if (!holdData) throw new BadRequestException('Hold expired or invalid');

    const checkIn = new Date(holdData.checkIn);
    const checkOut = new Date(holdData.checkOut);

    // Calculate final price
    const priceBreakdown = await this.calculatePrice({
      roomId: holdData.roomId,
      checkIn: holdData.checkIn,
      checkOut: holdData.checkOut,
      guests: holdData.guests,
      roomQuantity: holdData.roomQuantity,
      discountCode: data.discountCode
    });

    // Transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify availability one last time
      const room = await tx.room.findUnique({ where: { id: holdData.roomId } });
      const overlapping = await tx.booking.aggregate({
        _sum: { roomQuantity: true },
        where: {
          roomId: holdData.roomId,
          status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
          OR: [
            { checkIn: { lt: checkOut }, checkOut: { gt: checkIn } }
          ]
        }
      });
      const bookedRooms = overlapping._sum?.roomQuantity || 0;

      if (!room || (room.quantity - bookedRooms) < holdData.roomQuantity) {
        throw new BadRequestException('Room is no longer available in the requested quantity');
      }

      // 2. Create Booking
      const booking = await tx.booking.create({
        data: {
          userId,
          roomId: holdData.roomId,
          checkIn,
          checkOut,
          guests: holdData.guests,
          roomQuantity: holdData.roomQuantity,
          totalPrice: priceBreakdown.totalAmount,
          status: 'CONFIRMED',
          paymentMethod: data.paymentMethod
        }
      });

      // 3. Remove hold
      await this.cacheManager.del(`hold:${data.holdId}`);

      return booking;
    });
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: { include: { hotel: true } } }
    });

    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.userId !== userId) throw new BadRequestException('Not your booking');
    if (booking.status === 'CANCELLED') throw new BadRequestException('Booking is already cancelled');
    if (booking.status === 'COMPLETED' || booking.status === 'CHECKED_OUT') {
      throw new BadRequestException('Cannot cancel past booking');
    }

    const now = new Date();
    if (now >= booking.checkIn) {
      throw new BadRequestException('Cannot cancel booking on or after check-in date');
    }

    const msBeforeCheckIn = booking.checkIn.getTime() - now.getTime();
    const daysBeforeCheckIn = Math.floor(msBeforeCheckIn / (1000 * 60 * 60 * 24));

    // Get policies for the hotel, ordered by daysBeforeCheckIn desc
    const policies = await this.prisma.cancellationPolicy.findMany({
      where: { hotelId: booking.room.hotelId },
      orderBy: { daysBeforeCheckIn: 'desc' }
    });

    // Find the applicable policy: the one where the rule's days <= actual days
    // e.g. if actual is 5 days, and rules are [7 days (50%), 3 days (100%)], 
    // it falls into the 3 days policy if we order appropriately, or we pick the closest one that is <= daysBeforeCheckIn.
    // Let's iterate and find the first policy where daysBeforeCheckIn >= rule.daysBeforeCheckIn
    let penaltyPercentage = 100; // default no refund if no policy matches? Or 0? Let's say 0 penalty by default
    if (policies.length > 0) {
      penaltyPercentage = 100; // default full penalty
      for (const p of policies) {
        if (daysBeforeCheckIn >= p.daysBeforeCheckIn) {
          penaltyPercentage = p.penaltyPercentage;
          break;
        }
      }
    } else {
      // If host didn't set policy, we assume free cancellation
      penaltyPercentage = 0;
    }

    const penaltyAmount = booking.totalPrice * (penaltyPercentage / 100);
    const refundAmount = Math.max(0, booking.totalPrice - penaltyAmount);

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        refundAmount
      }
    });
  }

  async getMyTrips(userId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        include: {
          room: {
            include: {
              hotel: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.booking.count({ where: { userId } })
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit)
    };
  }
}
