import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './dto/pricing-rule.dto';
import { Role } from '@prisma/client';
export declare class PricingRulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, role: Role, data: CreatePricingRuleDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        hotelId: string;
        multiplier: number | null;
        flatFee: number | null;
        startDate: Date | null;
        endDate: Date | null;
        dayOfWeek: number | null;
    }>;
    findAll(hotelId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        hotelId: string;
        multiplier: number | null;
        flatFee: number | null;
        startDate: Date | null;
        endDate: Date | null;
        dayOfWeek: number | null;
    }[]>;
    update(id: string, userId: string, role: Role, data: UpdatePricingRuleDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        hotelId: string;
        multiplier: number | null;
        flatFee: number | null;
        startDate: Date | null;
        endDate: Date | null;
        dayOfWeek: number | null;
    }>;
    remove(id: string, userId: string, role: Role): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        hotelId: string;
        multiplier: number | null;
        flatFee: number | null;
        startDate: Date | null;
        endDate: Date | null;
        dayOfWeek: number | null;
    }>;
}
