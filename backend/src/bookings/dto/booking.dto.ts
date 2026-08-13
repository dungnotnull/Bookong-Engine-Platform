import { IsString, IsDateString, IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';

export class HoldRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @IsInt()
  @Min(1)
  guests!: number;
}

export class CalculatePriceDto extends HoldRoomDto {
  @IsOptional()
  @IsString()
  discountCode?: string;
}

export class SubmitBookingDto {
  @IsString()
  @IsNotEmpty()
  holdId!: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsOptional()
  @IsString()
  discountCode?: string;
}
