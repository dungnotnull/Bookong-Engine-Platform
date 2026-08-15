import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  locationRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  cleanlinessRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  serviceRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  valueRating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
