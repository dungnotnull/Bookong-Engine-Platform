import { BookingStatus } from '@prisma/client';
export declare class UpdateBookingStatusDto {
    status: BookingStatus;
}
export declare class AnalyticsQueryDto {
    hotelId: string;
    startDate: string;
    endDate: string;
}
