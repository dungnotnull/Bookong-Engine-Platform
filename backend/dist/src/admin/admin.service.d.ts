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
        fullName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
    }[]>;
    updateUserRole(id: string, data: UpdateUserRoleDto): Promise<{
        fullName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
    }>;
    deleteUser(id: string): Promise<{
        fullName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getHotels(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<({
        host: {
            fullName: string | null;
            email: string;
        };
    } & {
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
    })[]>;
    updateHotelStatus(id: string, data: UpdateHotelStatusDto): Promise<{
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
    }>;
}
