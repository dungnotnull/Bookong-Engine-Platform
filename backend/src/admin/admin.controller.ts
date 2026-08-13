import { Controller, Get, Patch, Delete, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role, HotelStatus } from '@prisma/client';
import { UpdateHotelStatusDto, UpdateUserRoleDto, ApproveHotelDto, UpdateUserStatusDto, CreateAdminDto } from './dto/admin.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  async getDashboardStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  @Get('users')
  async getAllUsers(@Query() query: PaginationQueryDto) {
    const users = await this.adminService.getAllUsers(query);
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

  @Get('hotels/pending')
  async getPendingHotels(@Query() query: PaginationQueryDto) {
    const hotels = await this.adminService.getHotels({ ...query, status: HotelStatus.PENDING });
    return { success: true, ...hotels };
  }

  @Get('hotels')
  async getHotels(@Query() query: PaginationQueryDto & { status?: HotelStatus }) {
    const hotels = await this.adminService.getHotels(query);
    return { success: true, data: hotels };
  }

  @Patch('hotels/:id/status')
  async updateHotelStatus(
    @Param('id') id: string,
    @Body() data: UpdateHotelStatusDto,
  ) {
    const hotel = await this.adminService.updateHotelStatus(id, data.status);
    return { success: true, data: hotel };
  }

  @Patch('hotels/:id/approve')
  async approveHotel(
    @Param('id') id: string,
    @Body() data: ApproveHotelDto,
  ) {
    const status = data.isApproved ? HotelStatus.APPROVED : HotelStatus.REJECTED;
    const hotel = await this.adminService.updateHotelStatus(id, status);
    return { success: true, data: hotel };
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() data: UpdateUserStatusDto,
  ) {
    const user = await this.adminService.updateUserStatus(id, data.isBanned);
    return { success: true, data: user };
  }

  @Post('users')
  async createAdmin(@Body() data: CreateAdminDto) {
    const admin = await this.adminService.createAdmin(data);
    return { success: true, data: admin };
  }
}
