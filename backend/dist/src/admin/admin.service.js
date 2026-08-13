"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count();
        const pendingHotels = await this.prisma.hotel.count({ where: { status: 'PENDING' } });
        const totalHotels = await this.prisma.hotel.count();
        const totalRooms = await this.prisma.room.count();
        return {
            totalUsers,
            pendingHotels,
            totalHotels,
            totalRooms,
            totalGMV: 1250000000,
        };
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserRole(id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { role: data.role },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            }
        });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.delete({ where: { id } });
    }
    async getHotels(status) {
        return this.prisma.hotel.findMany({
            where: status ? { status } : undefined,
            include: {
                host: { select: { email: true, fullName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateHotelStatus(id, data) {
        const hotel = await this.prisma.hotel.findUnique({ where: { id } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        return this.prisma.hotel.update({
            where: { id },
            data: { status: data.status },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map