import { IsString, IsNotEmpty, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateCancellationPolicyDto {
  @IsString()
  @IsNotEmpty()
  hotelId!: string;

  @IsInt()
  @Min(0)
  daysBeforeCheckIn!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  penaltyPercentage!: number;
}

export class UpdateCancellationPolicyDto {
  @IsInt()
  @Min(0)
  daysBeforeCheckIn?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  penaltyPercentage?: number;
}
