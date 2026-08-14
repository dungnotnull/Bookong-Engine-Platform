import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST)
  create(@Request() req: any, @Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(req.user.id, createHotelDto);
  }

  @Get('my-hotels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST)
  findMyHotels(@Request() req: any, @Query() query: PaginationQueryDto) {
    return this.hotelsService.findMyHotels(req.user.id, query);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.hotelsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('checkIn') checkIn?: string, @Query('checkOut') checkOut?: string) {
    return this.hotelsService.findOne(id, checkIn, checkOut);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  update(@Param('id') id: string, @Request() req: any, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, req.user.id, req.user.role, updateHotelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.hotelsService.remove(id, req.user.id, req.user.role);
  }
}
