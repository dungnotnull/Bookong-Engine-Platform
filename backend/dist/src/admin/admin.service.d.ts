import { PrismaService } from '../prisma/prisma.service';
import { UpdateHotelStatusDto, UpdateUserRoleDto } from './dto/admin.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        pendingHotels: number;
        totalHotels: number;
        totalRooms: number;
        totalGMV: number;
    }>;
    getAllUsers(): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
    }[]>;
    updateUserRole(id: string, data: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    getHotels(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        hostId: string;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateHotelStatus(id: string, data: UpdateHotelStatusDto): Promise<{
        id: string;
        hostId: string;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
