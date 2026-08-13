import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('hotels/:hotelId/rooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST)
  create(@Param('hotelId') hotelId: string, @Request() req: any, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(hotelId, req.user.id, req.user.role, createRoomDto);
  }

  @Get('hotels/:hotelId/rooms')
  findAllInHotel(
    @Param('hotelId') hotelId: string,
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string
  ) {
    return this.roomsService.findAllInHotel(hotelId, checkIn, checkOut);
  }

  @Get('rooms/:id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch('rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  update(@Param('id') id: string, @Request() req: any, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, req.user.id, req.user.role, updateRoomDto);
  }

  @Delete('rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.roomsService.remove(id, req.user.id, req.user.role);
  }
}
