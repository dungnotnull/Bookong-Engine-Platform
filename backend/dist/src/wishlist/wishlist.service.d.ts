import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistDto } from './dto/wishlist.dto';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<({
        hotel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            address: string;
            city: string;
            country: string;
            starRating: number;
            status: import("@prisma/client").$Enums.HotelStatus;
            hostId: string;
        };
    } & {
        hotelId: string;
        userId: string;
    })[]>;
    addWishlist(userId: string, data: AddWishlistDto): Promise<{
        hotelId: string;
        userId: string;
    }>;
    removeWishlist(userId: string, hotelId: string): Promise<{
        hotelId: string;
        userId: string;
    }>;
}
