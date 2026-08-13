export declare class CreateHotelDto {
    name: string;
    description?: string;
    address: string;
    city: string;
    country: string;
    starRating?: number;
    amenities?: string[];
}
export declare class UpdateHotelDto {
    name?: string;
    description?: string;
    address?: string;
    city?: string;
    country?: string;
    starRating?: number;
    amenities?: string[];
}
