import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CancellationPoliciesService } from './cancellation-policies.service';
import { CreateCancellationPolicyDto, UpdateCancellationPolicyDto } from './dto/cancellation-policy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('cancellation-policies')
export class CancellationPoliciesController {
  constructor(private readonly policiesService: CancellationPoliciesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Post()
  async create(@Request() req: any, @Body() data: CreateCancellationPolicyDto) {
    return this.policiesService.create(req.user.id, req.user.role, data);
  }

  @Get()
  async findAll(@Query('hotelId') hotelId: string) {
    return this.policiesService.findAll(hotelId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: UpdateCancellationPolicyDto) {
    return this.policiesService.update(id, req.user.id, req.user.role, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.policiesService.remove(id, req.user.id, req.user.role);
    return { message: 'Policy deleted' };
  }
}
