import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { HoldRoomDto, SubmitBookingDto, CalculatePriceDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('hold')
  async holdRoom(@Body() data: HoldRoomDto) {
    return this.bookingsService.holdRoom(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-trips')
  async getMyTrips(@Request() req: any) {
    return this.bookingsService.getMyTrips(req.user.id);
  }

  @Post('calculate-price')
  async calculatePrice(@Body() data: CalculatePriceDto) {
    return this.bookingsService.calculatePrice(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async submitBooking(@Request() req: any, @Body() data: SubmitBookingDto) {
    return this.bookingsService.submitBooking(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelBooking(@Request() req: any, @Param('id') id: string) {
    return this.bookingsService.cancelBooking(id, req.user.id);
  }
}
