import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        hotel: true
      }
    });
  }

  async addWishlist(userId: string, data: AddWishlistDto) {
    const exists = await this.prisma.wishlist.findUnique({
      where: {
        userId_hotelId: {
          userId,
          hotelId: data.hotelId
        }
      }
    });
    
    if (exists) {
      return exists;
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        hotelId: data.hotelId
      }
    });
  }

  async removeWishlist(userId: string, hotelId: string) {
    return this.prisma.wishlist.deleteMany({
      where: {
        userId,
        hotelId
      }
    });
  }
}
