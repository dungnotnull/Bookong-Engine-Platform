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

  async getAggregateAnalytics(userId: string) {
    // 1. Get all hotels owned by the host
    const hotels = await this.prisma.hotel.findMany({
      where: { hostId: userId },
      select: { id: true }
    });
    const totalHotels = hotels.length;
    const hotelIds = hotels.map(h => h.id);

    if (totalHotels === 0) {
      return { totalHotels: 0, totalRooms: 0, monthlyBookings: 0, occupancyRate: 0 };
    }

    // 2. Get total rooms
    const rooms = await this.prisma.room.findMany({
      where: { hotelId: { in: hotelIds } }
    });
    
    let totalRooms = 0;
    for (const room of rooms) {
      totalRooms += room.quantity;
    }

    // 3. Get monthly bookings (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyBookings = await this.prisma.booking.count({
      where: {
        room: { hotelId: { in: hotelIds } },
        createdAt: { gte: startOfMonth, lte: endOfMonth }
      }
    });

    // 4. Calculate rough occupancy rate for the current month
    const totalDays = endOfMonth.getDate();
    let totalRoomNights = totalRooms * totalDays;
    
    if (totalRoomNights === 0) {
      return { totalHotels, totalRooms, monthlyBookings, occupancyRate: 0 };
    }

    const bookingsThisMonth = await this.prisma.booking.findMany({
      where: {
        room: { hotelId: { in: hotelIds } },
        status: { in: ['CONFIRMED', 'COMPLETED', 'CHECKED_IN', 'CHECKED_OUT'] },
        checkIn: { lt: endOfMonth },
        checkOut: { gt: startOfMonth }
      }
    });

    let bookedNights = 0;
    for (const b of bookingsThisMonth) {
      const start = b.checkIn > startOfMonth ? b.checkIn : startOfMonth;
      const end = b.checkOut < endOfMonth ? b.checkOut : endOfMonth;
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      bookedNights += days;
    }

    const occupancyRate = (bookedNights / totalRoomNights) * 100;

    return {
      totalHotels,
      totalRooms,
      monthlyBookings,
      occupancyRate: Math.round(occupancyRate * 100) / 100 // Round to 2 decimal places
    };
  }
}
