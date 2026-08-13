import { HostService } from './host.service';
import { UpdateBookingStatusDto, AnalyticsQueryDto } from './dto/host.dto';
export declare class HostController {
    private readonly hostService;
    constructor(hostService: HostService);
    getBookings(req: any): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    updateBookingStatus(id: string, req: any, data: UpdateBookingStatusDto): Promise<{
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
    getRevenue(req: any, query: AnalyticsQueryDto): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
        };
    }>;
    getOccupancy(req: any, query: AnalyticsQueryDto): Promise<{
        success: boolean;
        data: {
            occupancyRate: number;
            bookedNights: number;
            totalRoomNights: number;
        };
    }>;
}
