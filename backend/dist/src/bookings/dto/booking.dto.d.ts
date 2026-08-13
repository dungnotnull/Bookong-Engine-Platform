export declare class HoldRoomDto {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
}
export declare class CalculatePriceDto extends HoldRoomDto {
    discountCode?: string;
}
export declare class SubmitBookingDto {
    holdId: string;
    paymentMethod: string;
    discountCode?: string;
}
