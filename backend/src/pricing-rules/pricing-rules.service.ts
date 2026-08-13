import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './dto/pricing-rule.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PricingRulesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, role: Role, data: CreatePricingRuleDto) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: data.hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (role !== Role.ADMIN && hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to add pricing rule to this hotel');
    }

    return this.prisma.pricingRule.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }
    });
  }

  async findAll(hotelId: string) {
    return this.prisma.pricingRule.findMany({
      where: { hotelId }
    });
  }

  async update(id: string, userId: string, role: Role, data: UpdatePricingRuleDto) {
    const rule = await this.prisma.pricingRule.findUnique({ where: { id }, include: { hotel: true } });
    if (!rule) throw new NotFoundException('Rule not found');
    
    if (role !== Role.ADMIN && rule.hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to update this rule');
    }

    return this.prisma.pricingRule.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const rule = await this.prisma.pricingRule.findUnique({ where: { id }, include: { hotel: true } });
    if (!rule) throw new NotFoundException('Rule not found');
    
    if (role !== Role.ADMIN && rule.hotel.hostId !== userId) {
      throw new ForbiddenException('Not allowed to delete this rule');
    }

    return this.prisma.pricingRule.delete({ where: { id } });
  }
}
