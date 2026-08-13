import { BookingsService } from './bookings.service';
import { HoldRoomDto, SubmitBookingDto, CalculatePriceDto } from './dto/booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    holdRoom(data: HoldRoomDto): Promise<{
        success: boolean;
        data: {
            holdId: string;
            expiresAt: Date;
        };
    }>;
    calculatePrice(data: CalculatePriceDto): Promise<{
        success: boolean;
        data: {
            basePrice: number;
            seasonalSurge: number;
            discountAmount: number;
            totalAmount: number;
        };
    }>;
    submitBooking(req: any, data: SubmitBookingDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            roomId: string;
            checkIn: Date;
            checkOut: Date;
            guests: number;
            paymentMethod: string | null;
            totalPrice: number;
            refundAmount: number | null;
            userId: string;
        };
    }>;
    cancelBooking(req: any, id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            roomId: string;
            checkIn: Date;
            checkOut: Date;
            guests: number;
            paymentMethod: string | null;
            totalPrice: number;
            refundAmount: number | null;
            userId: string;
        };
    }>;
}
