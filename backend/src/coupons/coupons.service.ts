import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, role: Role, data: CreateCouponDto) {
    // Hosts can only create coupons for their own hotels/bookings
    // Admins can create global coupons
    const hostId = role === Role.ADMIN ? null : userId;
    
    return this.prisma.coupon.create({
      data: {
        ...data,
        hostId
      }
    });
  }

  async findAll(userId: string, role: Role) {
    if (role === Role.ADMIN) {
      return this.prisma.coupon.findMany();
    }
    return this.prisma.coupon.findMany({
      where: { hostId: userId }
    });
  }

  async update(id: string, userId: string, role: Role, data: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    
    if (role !== Role.ADMIN && coupon.hostId !== userId) {
      throw new ForbiddenException('Not allowed to update this coupon');
    }

    return this.prisma.coupon.update({
      where: { id },
      data
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (role !== Role.ADMIN && coupon.hostId !== userId) {
      throw new ForbiddenException('Not allowed to delete this coupon');
    }

    return this.prisma.coupon.delete({ where: { id } });
  }
}
