import { IsEnum, IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}

export class AnalyticsQueryDto {
  @IsString()
  @IsNotEmpty()
  hotelId!: string;
  
  @IsDateString()
  startDate!: string;
  
  @IsDateString()
  endDate!: string;
}
