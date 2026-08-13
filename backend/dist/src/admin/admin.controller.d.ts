import { AdminService } from './admin.service';
import { HotelStatus } from '@prisma/client';
import { UpdateHotelStatusDto, UpdateUserRoleDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            pendingHotels: number;
            totalHotels: number;
            totalRooms: number;
            totalGMV: number;
        };
    }>;
    getAllUsers(): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            email: string;
            fullName: string | null;
            role: import("@prisma/client").$Enums.Role;
        }[];
    }>;
    updateUserRole(id: string, data: UpdateUserRoleDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            fullName: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getHotels(status?: HotelStatus): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
    updateHotelStatus(id: string, data: UpdateHotelStatusDto): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
