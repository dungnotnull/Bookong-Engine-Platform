import { IsEnum, IsOptional, IsString, IsBoolean, IsEmail, MinLength } from 'class-validator';
import { Role, HotelStatus } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role!: Role;
}

export class UpdateHotelStatusDto {
  @IsEnum(HotelStatus)
  status!: HotelStatus;
}

export class ApproveHotelDto {
  @IsBoolean()
  isApproved!: boolean;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isBanned!: boolean;
}

export class CreateAdminDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
