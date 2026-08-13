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

  async findAllInHotel(hotelId: string, checkIn?: string, checkOut?: string) {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn).toISOString();
      const checkOutDate = new Date(checkOut).toISOString();
      const params = [hotelId, checkInDate, checkOutDate];
      
      const rawSql = `
        SELECT r.*,
               (r.quantity - COALESCE(b.booked_count, 0)) AS "availableQuantity"
        FROM "Room" r
        LEFT JOIN (
          SELECT "roomId", COUNT(id) as booked_count
          FROM "Booking"
          WHERE status IN ('CONFIRMED', 'PENDING_PAYMENT')
            AND "checkIn" < $3::timestamp
            AND "checkOut" > $2::timestamp
          GROUP BY "roomId"
        ) b ON r.id = b."roomId"
        WHERE r."hotelId" = $1
      `;
      
      const results = await this.prisma.$queryRawUnsafe<any[]>(rawSql, ...params);
      return results;
    }

    const rooms = await this.prisma.room.findMany({ where: { hotelId } });
    return rooms.map(room => ({ ...room, availableQuantity: room.quantity }));
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
    return this.prisma.room.delete({ where: { id } });
  }

  async syncVector(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { roomAmenities: { include: { amenity: true } } }
    });
    
    if (!room) return;

    const amenityNames = room.roomAmenities.map(ha => ha.amenity.name).join(' ');
    const textToEmbed = `${room.name} ${room.type} ${amenityNames}`.trim();
    
    if (!textToEmbed) return;

    const vector = await this.vectorService.getEmbedding(textToEmbed);
    const vectorStr = `[${vector.join(',')}]`;

    // Raw query to update pgvector column
    await this.prisma.$executeRaw`UPDATE "Room" SET "searchVector" = ${vectorStr}::vector WHERE id = ${room.id}`;
  }
}
