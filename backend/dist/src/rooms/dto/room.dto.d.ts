export declare class CreateRoomDto {
    name: string;
    type: string;
    basePrice: number;
    capacity: number;
    quantity: number;
    amenities?: string[];
}
export declare class UpdateRoomDto {
    name?: string;
    type?: string;
    basePrice?: number;
    capacity?: number;
    quantity?: number;
    amenities?: string[];
}
