import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(req: any, data: CreateCouponDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            hostId: string | null;
            quantity: number | null;
            code: string;
            discountType: import("@prisma/client").$Enums.DiscountType;
            amount: number;
            maxDiscount: number | null;
            minSpend: number | null;
            expiryDate: Date | null;
        };
    }>;
    findAll(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            hostId: string | null;
            quantity: number | null;
            code: string;
            discountType: import("@prisma/client").$Enums.DiscountType;
            amount: number;
            maxDiscount: number | null;
            minSpend: number | null;
            expiryDate: Date | null;
        }[];
    }>;
    update(id: string, req: any, data: UpdateCouponDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            hostId: string | null;
            quantity: number | null;
            code: string;
            discountType: import("@prisma/client").$Enums.DiscountType;
            amount: number;
            maxDiscount: number | null;
            minSpend: number | null;
            expiryDate: Date | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
