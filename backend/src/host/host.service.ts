import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBookingStatusDto, AnalyticsQueryDto } from './dto/host.dto';
import { PaginationQueryDto, buildPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class HostService {
  constructor(private prisma: PrismaService) {}

  async getBookings(userId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const where = {
      room: {
        hotel: {
          hostId: userId
        }
      }
    };

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          room: true,
          user: { select: { id: true, email: true, fullName: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.booking.count({ where })
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit)
    };
  }

  async updateBookingStatus(bookingId: string, userId: string, data: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: { include: { hotel: true } } }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.room.hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to update this booking');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: data.status }
    });
  }

  async getRevenue(userId: string, query: AnalyticsQueryDto) {
    // Verify hotel belongs to host
    const hotel = await this.prisma.hotel.findUnique({ where: { id: query.hotelId } });
    if (!hotel || hotel.hostId !== userId) {
      throw new ForbiddenException('Not your hotel');
    }

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    const result = await this.prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        room: { hotelId: query.hotelId },
        status: { in: ['CONFIRMED', 'COMPLETED', 'CHECKED_OUT'] },
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return { totalRevenue: result._sum.totalPrice || 0 };
  }

  async getOccupancy(userId: string, query: AnalyticsQueryDto) {
    // Verify hotel belongs to host
    const hotel = await this.prisma.hotel.findUnique({ where: { id: query.hotelId } });
    if (!hotel || hotel.hostId !== userId) {
      throw new ForbiddenException('Not your hotel');
    }

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    
    // Total days in period
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Get total rooms and their quantity
    const rooms = await this.prisma.room.findMany({ where: { hotelId: query.hotelId } });
    let totalRoomNights = 0;
    for (const r of rooms) {
      totalRoomNights += (r.quantity * totalDays);
    }

    if (totalRoomNights === 0) return { occupancyRate: 0, bookedNights: 0, totalRoomNights: 0 };

    // Get bookings intersecting this period
    const bookings = await this.prisma.booking.findMany({
      where: {
        room: { hotelId: query.hotelId },
        status: { in: ['CONFIRMED', 'COMPLETED', 'CHECKED_IN', 'CHECKED_OUT'] },
        checkIn: { lt: endDate },
        checkOut: { gt: startDate }
      }
    });

    let bookedNights = 0;
    for (const b of bookings) {
      // Calculate intersection days
      const start = b.checkIn > startDate ? b.checkIn : startDate;
      const end = b.checkOut < endDate ? b.checkOut : endDate;
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      bookedNights += days;
    }

    return {
      occupancyRate: (bookedNights / totalRoomNights) * 100,
      bookedNights,
      totalRoomNights
    };
  }
}
