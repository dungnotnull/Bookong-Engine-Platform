import { DiscountType } from '@prisma/client';
export declare class CreateCouponDto {
    code: string;
    discountType: DiscountType;
    amount: number;
    maxDiscount?: number;
    minSpend?: number;
    quantity?: number;
    expiryDate?: string;
}
export declare class UpdateCouponDto extends CreateCouponDto {
}
