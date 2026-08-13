import { Controller, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HostService } from './host.service';
import { UpdateBookingStatusDto, AnalyticsQueryDto } from './dto/host.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.HOST)
@Controller('host')
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Get('bookings')
  async getBookings(@Request() req: any, @Query() query: PaginationQueryDto) {
    return this.hostService.getBookings(req.user.id, query);
  }

  @Patch('bookings/:id/status')
  async updateBookingStatus(@Param('id') id: string, @Request() req: any, @Body() data: UpdateBookingStatusDto) {
    const result = await this.hostService.updateBookingStatus(id, req.user.id, data);
    return { success: true, data: result };
  }

  @Get('analytics')
  async getAggregateAnalytics(@Request() req: any) {
    const result = await this.hostService.getAggregateAnalytics(req.user.id);
    return { success: true, data: result };
  }

  @Get('analytics/revenue')
  async getRevenue(@Request() req: any, @Query() query: AnalyticsQueryDto) {
    const result = await this.hostService.getRevenue(req.user.id, query);
    return { success: true, data: result };
  }

  @Get('analytics/occupancy')
  async getOccupancy(@Request() req: any, @Query() query: AnalyticsQueryDto) {
    const result = await this.hostService.getOccupancy(req.user.id, query);
    return { success: true, data: result };
  }
}
