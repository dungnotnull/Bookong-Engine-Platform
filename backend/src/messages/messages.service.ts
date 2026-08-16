import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getMessagesByBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: { hotel: true },
        },
      },
    });

    if (!booking) {
      throw new ForbiddenException('Booking not found');
    }

    const isHost = booking.room.hotel.hostId === userId;
    const isGuest = booking.userId === userId;

    if (!isHost && !isGuest) {
      throw new ForbiddenException('You do not have access to these messages');
    }

    return this.prisma.message.findMany({
      where: { bookingId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async saveMessage(bookingId: string, senderId: string, content: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: { include: { hotel: true } },
      },
    });

    if (!booking) throw new Error('Booking not found');

    const receiverId = booking.userId === senderId ? booking.room.hotel.hostId : booking.userId;

    return this.prisma.message.create({
      data: {
        bookingId,
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
          }
        }
      }
    });
  }
}
