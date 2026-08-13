import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, HotelStatus } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role!: Role;
}

export class UpdateHotelStatusDto {
  @IsEnum(HotelStatus)
  status!: HotelStatus;
}
