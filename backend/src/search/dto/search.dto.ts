import { IsString, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class SearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  guests?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
