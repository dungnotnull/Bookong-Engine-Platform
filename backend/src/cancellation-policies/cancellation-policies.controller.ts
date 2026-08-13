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
    const result = await this.policiesService.create(req.user.userId, req.user.role, data);
    return { success: true, data: result };
  }

  @Get()
  async findAll(@Query('hotelId') hotelId: string) {
    const results = await this.policiesService.findAll(hotelId);
    return { success: true, data: results };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: UpdateCancellationPolicyDto) {
    const result = await this.policiesService.update(id, req.user.userId, req.user.role, data);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.policiesService.remove(id, req.user.userId, req.user.role);
    return { success: true, message: 'Policy deleted' };
  }
}
