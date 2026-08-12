import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmenityDto, UpdateAmenityDto } from './dto/amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAmenityDto) {
    return this.prisma.amenity.create({ data });
  }

  async findAll() {
    return this.prisma.amenity.findMany();
  }

  async update(id: string, data: UpdateAmenityDto) {
    const amenity = await this.prisma.amenity.findUnique({ where: { id } });
    if (!amenity) throw new NotFoundException('Amenity not found');
    return this.prisma.amenity.update({ where: { id }, data });
  }

  async remove(id: string) {
    const amenity = await this.prisma.amenity.findUnique({ where: { id } });
    if (!amenity) throw new NotFoundException('Amenity not found');
    return this.prisma.amenity.delete({ where: { id } });
  }
}
