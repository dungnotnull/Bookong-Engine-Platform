import { PrismaService } from '../prisma/prisma.service';
import { UpdateBookingStatusDto, AnalyticsQueryDto } from './dto/host.dto';
export declare class HostService {
    private prisma;
    constructor(prisma: PrismaService);
    getBookings(userId: string): Promise<({
        user: {
            fullName: string | null;
            email: string;
            id: string;
        };
        room: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            hotelId: string;
            type: string;
            basePrice: number;
            capacity: number;
            quantity: number;
        };
    } & {
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
    })[]>;
    updateBookingStatus(bookingId: string, userId: string, data: UpdateBookingStatusDto): Promise<{
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
    getRevenue(userId: string, query: AnalyticsQueryDto): Promise<{
        totalRevenue: number;
    }>;
    getOccupancy(userId: string, query: AnalyticsQueryDto): Promise<{
        occupancyRate: number;
        bookedNights: number;
        totalRoomNights: number;
    }>;
}
