import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './dto/pricing-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pricing-rules')
export class PricingRulesController {
  constructor(private readonly pricingRulesService: PricingRulesService) {}

  @Roles(Role.HOST, Role.ADMIN)
  @Post()
  async create(@Request() req: any, @Body() data: CreatePricingRuleDto) {
    const result = await this.pricingRulesService.create(req.user.userId, req.user.role, data);
    return { success: true, data: result };
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Get()
  async findAll(@Query('hotelId') hotelId: string) {
    const results = await this.pricingRulesService.findAll(hotelId);
    return { success: true, data: results };
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: UpdatePricingRuleDto) {
    const result = await this.pricingRulesService.update(id, req.user.userId, req.user.role, data);
    return { success: true, data: result };
  }

  @Roles(Role.HOST, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.pricingRulesService.remove(id, req.user.userId, req.user.role);
    return { success: true, message: 'Pricing rule deleted' };
  }
}
