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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CouponsService = class CouponsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, role, data) {
        const hostId = role === client_1.Role.ADMIN ? null : userId;
        return this.prisma.coupon.create({
            data: {
                ...data,
                hostId
            }
        });
    }
    async findAll(userId, role) {
        if (role === client_1.Role.ADMIN) {
            return this.prisma.coupon.findMany();
        }
        return this.prisma.coupon.findMany({
            where: { hostId: userId }
        });
    }
    async update(id, userId, role, data) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        if (role !== client_1.Role.ADMIN && coupon.hostId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to update this coupon');
        }
        return this.prisma.coupon.update({
            where: { id },
            data
        });
    }
    async remove(id, userId, role) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        if (role !== client_1.Role.ADMIN && coupon.hostId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to delete this coupon');
        }
        return this.prisma.coupon.delete({ where: { id } });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map