import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Roles(Role.HOST, Role.ADMIN)
  @Post()
  async create(@Request() req: any, @Body() data: CreateCouponDto) {
    const result = await this.couponsService.create(req.user.userId, req.user.role, data);
    return { success: true, data: result };
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Get()
  async findAll(@Request() req: any) {
    const results = await this.couponsService.findAll(req.user.userId, req.user.role);
    return { success: true, data: results };
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: UpdateCouponDto) {
    const result = await this.couponsService.update(id, req.user.userId, req.user.role, data);
    return { success: true, data: result };
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.couponsService.remove(id, req.user.userId, req.user.role);
    return { success: true, message: 'Coupon deleted' };
  }
}
