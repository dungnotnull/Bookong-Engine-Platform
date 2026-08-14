import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHotelStatusDto, UpdateUserRoleDto, GetHotelsQueryDto } from './dto/admin.dto';
import { PaginationQueryDto, buildPaginationMeta } from '../common/dto/pagination.dto';
import { HotelStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const pendingHotelsCount = await this.prisma.hotel.count({ where: { status: 'PENDING' } });
    const totalHotels = await this.prisma.hotel.count();
    const totalRooms = await this.prisma.room.count();

    return {
      totalUsers,
      pendingHotelsCount,
      totalHotels,
      totalRooms,
      totalGMV: 1250000000, // Mocked until Bookings module is implemented
    };
  }

  async getAllUsers(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isBanned: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.user.count()
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit)
    };
  }

  async updateUserRole(id: string, data: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { role: data.role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.delete({ where: { id } });
  }

  async getHotels(query: GetHotelsQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const offset = (page - 1) * limit;

    const where = status ? { status } : undefined;

    const [data, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        include: {
          host: { select: { email: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.hotel.count({ where })
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit)
    };
  }

  async updateHotelStatus(id: string, status: HotelStatus) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id } });
    if (!hotel) throw new NotFoundException('Hotel not found');

    return this.prisma.hotel.update({
      where: { id },
      data: { status },
    });
  }

  async updateUserStatus(id: string, isBanned: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { isBanned },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isBanned: true,
      }
    });
  }

  async createAdmin(data: any) {
    const bcrypt = require('bcrypt');
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName || 'Người dùng',
        role: data.role || 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    });
  }
}
