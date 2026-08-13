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
    const results = await this.wishlistService.getWishlist(req.user.userId);
    return { success: true, data: results };
  }

  @Post()
  async addWishlist(@Request() req: any, @Body() data: AddWishlistDto) {
    const result = await this.wishlistService.addWishlist(req.user.userId, data);
    return { success: true, data: result };
  }

  @Delete(':hotelId')
  async removeWishlist(@Request() req: any, @Param('hotelId') hotelId: string) {
    await this.wishlistService.removeWishlist(req.user.userId, hotelId);
    return { success: true, message: 'Removed from wishlist' };
  }
}
