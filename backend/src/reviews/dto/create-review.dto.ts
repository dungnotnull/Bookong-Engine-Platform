import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  locationRating: number;

  @IsInt()
  @Min(1)
  @Max(10)
  cleanlinessRating: number;

  @IsInt()
  @Min(1)
  @Max(10)
  serviceRating: number;

  @IsInt()
  @Min(1)
  @Max(10)
  valueRating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
