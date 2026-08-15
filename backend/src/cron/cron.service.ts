import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private prisma: PrismaService) {}

  // Run every day at midnight to complete checked-out bookings
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCheckoutCron() {
    this.logger.log('Running auto-checkout cron job');
    const now = new Date();

    const result = await this.prisma.booking.updateMany({
      where: {
        status: BookingStatus.CHECKED_IN,
        checkOut: {
          lt: now, // If checkOut time has passed
        },
      },
      data: {
        status: BookingStatus.CHECKED_OUT,
      },
    });

    this.logger.log(`Auto-checked out ${result.count} bookings`);
  }

  // Run every hour to clear stale PENDING_PAYMENT bookings
  @Cron(CronExpression.EVERY_HOUR)
  async handleStalePendingBookings() {
    this.logger.log('Running stale pending bookings cron job');
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

    const result = await this.prisma.booking.updateMany({
      where: {
        status: BookingStatus.PENDING_PAYMENT,
        createdAt: {
          lt: thirtyMinsAgo,
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Cancelled ${result.count} stale PENDING_PAYMENT bookings`);
    }
  }
}
