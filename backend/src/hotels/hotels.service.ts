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
    const finalAmenities = amenities || amenityIds;
    const country = hotelData.country || 'Việt Nam';
    
    const hotel = await this.prisma.hotel.create({
      data: {
        ...hotelData,
        country,
        hostId,
        hotelAmenities: finalAmenities ? {
          create: finalAmenities.map(id => ({ amenityId: id }))
        } : undefined
      },
      include: { hotelAmenities: { include: { amenity: true } } }
    });

    await this.syncVector(hotel.id);
    return hotel;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where: { status: 'APPROVED' },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.hotel.count({ where: { status: 'APPROVED' } })
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit)
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

    return {
      data,
      meta: buildPaginationMeta(total, page, limit)
    };
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: { 
        rooms: true,
        hotelAmenities: { include: { amenity: true } } 
      }
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async update(id: string, hostId: string, role: string, data: UpdateHotelDto) {
    const hotel = await this.findOne(id);
    if (role !== 'ADMIN' && hotel.hostId !== hostId) {
      throw new ForbiddenException('You can only update your own hotel');
    }

    const { amenities, amenityIds, ...hotelData } = data;
    const finalAmenities = amenities || amenityIds;
    
    const updatedHotel = await this.prisma.hotel.update({
      where: { id },
      data: {
        ...hotelData,
        hotelAmenities: finalAmenities ? {
          deleteMany: {},
          create: finalAmenities.map(amId => ({ amenityId: amId }))
        } : undefined
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
  }
}
