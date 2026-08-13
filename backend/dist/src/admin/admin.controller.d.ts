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
            fullName: string | null;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
            createdAt: Date;
        }[];
    }>;
    updateUserRole(id: string, data: UpdateUserRoleDto): Promise<{
        success: boolean;
        data: {
            fullName: string | null;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        };
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getHotels(status?: HotelStatus): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    updateHotelStatus(id: string, data: UpdateHotelStatusDto): Promise<{
        success: boolean;
        data: {
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
    }>;
}
