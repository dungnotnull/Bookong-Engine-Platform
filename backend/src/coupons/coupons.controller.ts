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
    return this.couponsService.create(req.user.id, req.user.role, data);
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Get()
  async findAll(@Request() req: any) {
    return this.couponsService.findAll(req.user.id, req.user.role);
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: UpdateCouponDto) {
    return this.couponsService.update(id, req.user.id, req.user.role, data);
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.couponsService.remove(id, req.user.id, req.user.role);
    return { message: 'Coupon deleted' };
  }
}
