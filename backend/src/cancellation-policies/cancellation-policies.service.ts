import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCancellationPolicyDto, UpdateCancellationPolicyDto } from './dto/cancellation-policy.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CancellationPoliciesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, role: Role, data: CreateCancellationPolicyDto) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: data.hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (role !== Role.ADMIN && hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to add policy to this hotel');
    }

    return this.prisma.cancellationPolicy.create({ data });
  }

  async findAll(hotelId: string) {
    return this.prisma.cancellationPolicy.findMany({
      where: { hotelId },
      orderBy: { daysBeforeCheckIn: 'desc' }
    });
  }

  async update(id: string, userId: string, role: Role, data: UpdateCancellationPolicyDto) {
    const policy = await this.prisma.cancellationPolicy.findUnique({ where: { id }, include: { hotel: true } });
    if (!policy) throw new NotFoundException('Policy not found');
    
    if (role !== Role.ADMIN && policy.hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to update this policy');
    }

    return this.prisma.cancellationPolicy.update({
      where: { id },
      data
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const policy = await this.prisma.cancellationPolicy.findUnique({ where: { id }, include: { hotel: true } });
    if (!policy) throw new NotFoundException('Policy not found');
    
    if (role !== Role.ADMIN && policy.hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to delete this policy');
    }

    return this.prisma.cancellationPolicy.delete({ where: { id } });
  }
}
