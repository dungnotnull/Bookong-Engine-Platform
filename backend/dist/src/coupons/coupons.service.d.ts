import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { Role } from '@prisma/client';
export declare class CouponsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, role: Role, data: CreateCouponDto): Promise<{
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
    }>;
    findAll(userId: string, role: Role): Promise<{
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
    }[]>;
    update(id: string, userId: string, role: Role, data: UpdateCouponDto): Promise<{
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
    }>;
    remove(id: string, userId: string, role: Role): Promise<{
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
    }>;
}
