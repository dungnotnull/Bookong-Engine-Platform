import { PrismaService } from '../prisma/prisma.service';
import type { Cache } from 'cache-manager';
import { HoldRoomDto, SubmitBookingDto, CalculatePriceDto } from './dto/booking.dto';
export declare class BookingsService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    checkAvailability(roomId: string, checkIn: Date, checkOut: Date, guests: number): Promise<boolean>;
    holdRoom(data: HoldRoomDto): Promise<{
        holdId: string;
        expiresAt: Date;
    }>;
    calculatePrice(data: CalculatePriceDto): Promise<{
        basePrice: number;
        seasonalSurge: number;
        discountAmount: number;
        totalAmount: number;
    }>;
    submitBooking(userId: string, data: SubmitBookingDto): Promise<{
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
    }>;
    cancelBooking(bookingId: string, userId: string): Promise<{
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
    }>;
}
