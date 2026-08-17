import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorService: VectorService,
  ) {}

  async create(hotelId: string, hostId: string, role: string, data: CreateRoomDto) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (role !== 'ADMIN' && hotel.hostId !== hostId) {
      throw new ForbiddenException('You can only add rooms to your own hotel');
    }

    const { amenities, ...roomData } = data;
    const room = await this.prisma.room.create({
      data: {
        ...roomData,
        hotelId,
        roomAmenities: amenities ? {
          create: amenities.map(id => ({ amenityId: id }))
        } : undefined
      },
      include: { roomAmenities: { include: { amenity: true } } }
    });

    await this.syncVector(room.id);
    return room;
  }

  async findAllInHotel(hotelId: string, checkIn?: string, checkOut?: string, includeInactive?: boolean) {
    let ci = checkIn ? new Date(checkIn) : new Date();
    ci.setHours(14, 0, 0, 0);
    
    let co = checkOut ? new Date(checkOut) : new Date(ci.getTime() + 24 * 60 * 60 * 1000);
    co.setHours(12, 0, 0, 0);

    if (isNaN(ci.getTime()) || isNaN(co.getTime()) || ci >= co) {
      ci = new Date();
      ci.setHours(14, 0, 0, 0);
      co = new Date(ci.getTime() + 24 * 60 * 60 * 1000);
      co.setHours(12, 0, 0, 0);
    }

    const rooms = await this.prisma.room.findMany({
      where: {
        hotelId,
        ...(includeInactive ? {} : { isActive: true })
      },
      include: {
        roomAmenities: { include: { amenity: true } }
      }
    });

    const roomsWithAvailability = await Promise.all(
      rooms.map(async (room) => {
        const overlapping = await this.prisma.booking.aggregate({
          _sum: { roomQuantity: true },
          where: {
            roomId: room.id,
            status: { in: ['CONFIRMED', 'PENDING_PAYMENT', 'CHECKED_IN'] },
            OR: [
              { checkIn: { lt: co }, checkOut: { gt: ci } }
            ]
          }
        });

        const bookedRooms = overlapping._sum?.roomQuantity || 0;
        const availableQuantity = Math.max(0, room.quantity - bookedRooms);

        const amenities = room.roomAmenities?.map((ra) => ra.amenity) || [];

        return {
          ...room,
          amenities,
          availableQuantity,
        };
      })
    );

    return roomsWithAvailability;
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { roomAmenities: { include: { amenity: true } } }
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, hostId: string, role: string, data: UpdateRoomDto) {
    const room = await this.findOne(id);
    const hotel = await this.prisma.hotel.findUnique({ where: { id: room.hotelId } });
    if (role !== 'ADMIN' && hotel?.hostId !== hostId) {
      throw new ForbiddenException('You can only update rooms in your own hotel');
    }

    const { amenities, ...roomData } = data;
    const updatedRoom = await this.prisma.room.update({
      where: { id },
      data: {
        ...roomData,
        roomAmenities: amenities ? {
          deleteMany: {},
          create: amenities.map(amId => ({ amenityId: amId }))
        } : undefined
      },
      include: { roomAmenities: { include: { amenity: true } } }
    });

    await this.syncVector(updatedRoom.id);
    return updatedRoom;
  }

  async remove(id: string, hostId: string, role: string) {
    const room = await this.findOne(id);
    const hotel = await this.prisma.hotel.findUnique({ where: { id: room.hotelId } });
    if (role !== 'ADMIN' && hotel?.hostId !== hostId) {
      throw new ForbiddenException('You can only delete rooms in your own hotel');
    }
    return this.prisma.room.update({ where: { id }, data: { isActive: false } });
  }

  async syncVector(roomId: string) {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id: roomId },
        include: { roomAmenities: { include: { amenity: true } } }
      });
      
      if (!room) return;

      const amenityNames = room.roomAmenities.map(ha => ha.amenity.name).join(', ');
      const textToEmbed = `${room.name} (${room.type}) - Sức chứa ${room.capacity} người - Tiện nghi: ${amenityNames}`.trim();
      
      if (!textToEmbed) return;

      const vector = await this.vectorService.getEmbedding(textToEmbed);
      const vectorStr = `[${vector.join(',')}]`;

      // Raw query to update pgvector column
      await this.prisma.$executeRaw`UPDATE "Room" SET "searchVector" = ${vectorStr}::vector WHERE id = ${room.id}`;
    } catch (error) {
      console.error(`Failed to sync vector for room ${roomId}:`, error.message);
      // We swallow the error so that the main request (create/update room) can succeed
    }
  }
}
