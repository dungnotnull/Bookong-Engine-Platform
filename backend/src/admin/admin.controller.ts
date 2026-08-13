import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role, HotelStatus } from '@prisma/client';
import { UpdateHotelStatusDto, UpdateUserRoleDto } from './dto/admin.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.adminService.getAllUsers();
    return { success: true, data: users };
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() data: UpdateUserRoleDto,
  ) {
    const user = await this.adminService.updateUserRole(id, data);
    return { success: true, data: user };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return { success: true, message: 'User deleted successfully' };
  }

  @Get('hotels')
  async getHotels(@Query('status') status?: HotelStatus) {
    const hotels = await this.adminService.getHotels(status);
    return { success: true, data: hotels };
  }

  @Patch('hotels/:id/status')
  async updateHotelStatus(
    @Param('id') id: string,
    @Body() data: UpdateHotelStatusDto,
  ) {
    const hotel = await this.adminService.updateHotelStatus(id, data);
    return { success: true, data: hotel };
  }
}
