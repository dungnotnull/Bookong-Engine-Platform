import { IsString, IsNotEmpty } from 'class-validator';

export class AddWishlistDto {
  @IsString()
  @IsNotEmpty()
  hotelId!: string;
}
