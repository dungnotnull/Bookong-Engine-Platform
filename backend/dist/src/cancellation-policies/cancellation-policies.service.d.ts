import { PrismaService } from '../prisma/prisma.service';
import { CreateCancellationPolicyDto, UpdateCancellationPolicyDto } from './dto/cancellation-policy.dto';
import { Role } from '@prisma/client';
export declare class CancellationPoliciesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, role: Role, data: CreateCancellationPolicyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        daysBeforeCheckIn: number;
        penaltyPercentage: number;
    }>;
    findAll(hotelId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        daysBeforeCheckIn: number;
        penaltyPercentage: number;
    }[]>;
    update(id: string, userId: string, role: Role, data: UpdateCancellationPolicyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        daysBeforeCheckIn: number;
        penaltyPercentage: number;
    }>;
    remove(id: string, userId: string, role: Role): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        daysBeforeCheckIn: number;
        penaltyPercentage: number;
    }>;
}
