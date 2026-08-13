import { Controller, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HostService } from './host.service';
import { UpdateBookingStatusDto, AnalyticsQueryDto } from './dto/host.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.HOST)
@Controller('host')
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Get('bookings')
  async getBookings(@Request() req: any) {
    const results = await this.hostService.getBookings(req.user.userId);
    return { success: true, data: results };
  }

  @Patch('bookings/:id/status')
  async updateBookingStatus(@Param('id') id: string, @Request() req: any, @Body() data: UpdateBookingStatusDto) {
    const result = await this.hostService.updateBookingStatus(id, req.user.userId, data);
    return { success: true, data: result };
  }

  @Get('analytics/revenue')
  async getRevenue(@Request() req: any, @Query() query: AnalyticsQueryDto) {
    const result = await this.hostService.getRevenue(req.user.userId, query);
    return { success: true, data: result };
  }

  @Get('analytics/occupancy')
  async getOccupancy(@Request() req: any, @Query() query: AnalyticsQueryDto) {
    const result = await this.hostService.getOccupancy(req.user.userId, query);
    return { success: true, data: result };
  }
}
