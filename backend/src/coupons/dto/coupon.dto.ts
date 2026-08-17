import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { DiscountType, CouponStatus, CouponVisibility } from '@prisma/client';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsNumber()
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  minSpend?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  usageLimitPerUser?: number;

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;

  @IsOptional()
  @IsEnum(CouponVisibility)
  visibility?: CouponVisibility;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class UpdateCouponDto extends CreateCouponDto {}
