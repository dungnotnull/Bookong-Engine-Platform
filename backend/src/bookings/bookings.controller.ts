import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { HoldRoomDto, SubmitBookingDto, CalculatePriceDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('hold')
  async holdRoom(@Body() data: HoldRoomDto) {
    const result = await this.bookingsService.holdRoom(data);
    return { success: true, data: result };
  }

  @Post('calculate-price')
  async calculatePrice(@Body() data: CalculatePriceDto) {
    const result = await this.bookingsService.calculatePrice(data);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async submitBooking(@Request() req: any, @Body() data: SubmitBookingDto) {
    const result = await this.bookingsService.submitBooking(req.user.userId, data);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelBooking(@Request() req: any, @Param('id') id: string) {
    const result = await this.bookingsService.cancelBooking(id, req.user.userId);
    return { success: true, data: result };
  }
}
