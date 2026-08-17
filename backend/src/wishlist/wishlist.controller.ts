import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Request() req: any) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post()
  async addWishlist(@Request() req: any, @Body() data: AddWishlistDto) {
    return this.wishlistService.addWishlist(req.user.id, data);
  }

  @Delete(':hotelId')
  async removeWishlist(@Request() req: any, @Param('hotelId') hotelId: string) {
    await this.wishlistService.removeWishlist(req.user.id, hotelId);
    return { message: 'Removed from wishlist' };
  }
}
