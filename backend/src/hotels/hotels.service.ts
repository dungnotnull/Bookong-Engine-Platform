import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';
import { PaginationQueryDto, buildPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class HotelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorService: VectorService,
  ) {}

  async create(hostId: string, data: CreateHotelDto) {
    const { amenities, amenityIds, ...hotelData } = data;
    const finalAmenities = amenities || amenityIds || [];
    const country = hotelData.country || 'Việt Nam';
    
    // Resolve amenities to actual UUIDs
    const actualAmenityIds = await Promise.all(
      finalAmenities.map(async (am) => {
        let amenity = await this.prisma.amenity.findFirst({
          where: { OR: [{ id: am }, { name: { equals: am, mode: 'insensitive' } }] }
        });
        if (!amenity) {
          amenity = await this.prisma.amenity.create({ data: { name: am } });
        }
        return amenity.id;
      })
    );

    const hotel = await this.prisma.hotel.create({
      data: {
        ...hotelData,
        country,
        hostId,
        hotelAmenities: actualAmenityIds.length > 0 ? {
          create: actualAmenityIds.map(id => ({ amenityId: id }))
        } : undefined
      },
      include: { hotelAmenities: { include: { amenity: true } } }
    });

    await this.syncVector(hotel.id);
    return hotel;
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = { status: 'APPROVED' };

    // Handle categories
    if (category && category !== 'all') {
      switch (category) {
        case 'hotel':
          where.OR = [{ name: { contains: 'khách sạn', mode: 'insensitive' } }, { name: { contains: 'hotel', mode: 'insensitive' } }];
          break;
        case 'resort':
          where.OR = [{ name: { contains: 'resort', mode: 'insensitive' } }, { name: { contains: 'khu nghỉ dưỡng', mode: 'insensitive' } }];
          break;
        case 'homestay':
          where.OR = [{ name: { contains: 'homestay', mode: 'insensitive' } }];
          break;
        case 'villa':
          where.OR = [{ name: { contains: 'villa', mode: 'insensitive' } }, { name: { contains: 'biệt thự', mode: 'insensitive' } }];
          break;
        case 'apartment':
          where.OR = [{ name: { contains: 'căn hộ', mode: 'insensitive' } }, { name: { contains: 'apartment', mode: 'insensitive' } }];
          break;
        case 'beach':
          where.OR = [
            { address: { contains: 'biển', mode: 'insensitive' } },
            { description: { contains: 'biển', mode: 'insensitive' } },
            { description: { contains: 'beach', mode: 'insensitive' } }
          ];
          break;
        case 'pool':
          where.hotelAmenities = { some: { amenity: { name: { contains: 'hồ bơi', mode: 'insensitive' } } } };
          break;
        case 'luxury':
          where.starRating = { gte: 4 };
          break;
        case 'nature':
          where.OR = [
            { description: { contains: 'thiên nhiên', mode: 'insensitive' } },
            { description: { contains: 'núi', mode: 'insensitive' } },
            { description: { contains: 'forest', mode: 'insensitive' } }
          ];
          break;
      }
    }

    // Handle price filters by checking room basePrice
    if (minPrice || maxPrice) {
      where.rooms = { some: { basePrice: {} } };
      if (minPrice) where.rooms.some.basePrice.gte = Number(minPrice);
      if (maxPrice) where.rooms.some.basePrice.lte = Number(maxPrice);
    }

    const [data, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip: offset,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { rooms: true } // Include rooms to get price info on frontend if needed
      }),
      this.prisma.hotel.count({ where })
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, Number(page), Number(limit))
    };
  }

  async findMyHotels(hostId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where: { hostId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.hotel.count({ where: { hostId } })
    ]);

    const mappedData = data.map(hotel => ({
      ...hotel,
      isApproved: hotel.status === 'APPROVED'
    }));

    return {
      data: mappedData,
      meta: buildPaginationMeta(total, page, limit)
    };
  }

  async findOne(id: string, checkIn?: string, checkOut?: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: { 
        rooms: true,
        hotelAmenities: { include: { amenity: true } } 
      }
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (checkIn && checkOut) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      
      if (ci < co) {
        const availableRooms: typeof hotel.rooms = [];
        for (const room of hotel.rooms) {
          const overlapping = await this.prisma.booking.aggregate({
            _sum: { roomQuantity: true },
            where: {
              roomId: room.id,
              status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
              OR: [
                { checkIn: { lt: co }, checkOut: { gt: ci } }
              ]
            }
          });
          const bookedRooms = overlapping._sum?.roomQuantity || 0;
          if (room.quantity - bookedRooms >= 1) {
            availableRooms.push(room);
          }
        }
        hotel.rooms = availableRooms;
      }
    }

    return hotel;
  }

  async update(id: string, hostId: string, role: string, data: UpdateHotelDto) {
    const hotel = await this.findOne(id);
    if (role !== 'ADMIN' && hotel.hostId !== hostId) {
      throw new ForbiddenException('You can only update your own hotel');
    }

    const { amenities, amenityIds, ...hotelData } = data;
    const finalAmenities = amenities || amenityIds || [];
    
    // Resolve amenities to actual UUIDs
    const actualAmenityIds = await Promise.all(
      finalAmenities.map(async (am) => {
        let amenity = await this.prisma.amenity.findFirst({
          where: { OR: [{ id: am }, { name: { equals: am, mode: 'insensitive' } }] }
        });
        if (!amenity) {
          amenity = await this.prisma.amenity.create({ data: { name: am } });
        }
        return amenity.id;
      })
    );

    const updatedHotel = await this.prisma.hotel.update({
      where: { id },
      data: {
        ...hotelData,
        hotelAmenities: actualAmenityIds.length > 0 ? {
          deleteMany: {},
          create: actualAmenityIds.map(amId => ({ amenityId: amId }))
        } : { deleteMany: {} }
      },
      include: { hotelAmenities: { include: { amenity: true } } }
    });

    await this.syncVector(updatedHotel.id);
    return updatedHotel;
  }

  async remove(id: string, hostId: string, role: string) {
    const hotel = await this.findOne(id);
    if (role !== 'ADMIN' && hotel.hostId !== hostId) {
      throw new ForbiddenException('You can only delete your own hotel');
    }
    return this.prisma.hotel.delete({ where: { id } });
  }

  async syncVector(hotelId: string) {
    try {
      const hotel = await this.prisma.hotel.findUnique({
        where: { id: hotelId },
        include: { hotelAmenities: { include: { amenity: true } } }
      });
      
      if (!hotel) return;

      const amenityNames = hotel.hotelAmenities.map(ha => ha.amenity.name).join(' ');
      const textToEmbed = `${hotel.name} ${hotel.description || ''} ${amenityNames}`.trim();
      
      if (!textToEmbed) return;

      const vector = await this.vectorService.getEmbedding(textToEmbed);
      const vectorStr = `[${vector.join(',')}]`;

      // Raw query to update pgvector column
      await this.prisma.$executeRaw`UPDATE "Hotel" SET "searchVector" = ${vectorStr}::vector WHERE id = ${hotel.id}`;
    } catch (error) {
      console.warn(`[WARNING] Failed to sync vector for hotel ${hotelId}: Python Vector Service might be down.`);
    }
  }
}
