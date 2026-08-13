import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto/wishlist.dto';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: any): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    addWishlist(req: any, data: AddWishlistDto): Promise<{
        success: boolean;
        data: {
            hotelId: string;
            userId: string;
        };
    }>;
    removeWishlist(req: any, hotelId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
