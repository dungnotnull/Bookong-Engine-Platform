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
exports.PricingRulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PricingRulesService = class PricingRulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, role, data) {
        const hotel = await this.prisma.hotel.findUnique({ where: { id: data.hotelId } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (role !== client_1.Role.ADMIN && hotel.hostId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to add pricing rule to this hotel');
        }
        return this.prisma.pricingRule.create({
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            }
        });
    }
    async findAll(hotelId) {
        return this.prisma.pricingRule.findMany({
            where: { hotelId }
        });
    }
    async update(id, userId, role, data) {
        const rule = await this.prisma.pricingRule.findUnique({ where: { id }, include: { hotel: true } });
        if (!rule)
            throw new common_1.NotFoundException('Rule not found');
        if (role !== client_1.Role.ADMIN && rule.hotel.hostId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to update this rule');
        }
        return this.prisma.pricingRule.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            }
        });
    }
    async remove(id, userId, role) {
        const rule = await this.prisma.pricingRule.findUnique({ where: { id }, include: { hotel: true } });
        if (!rule)
            throw new common_1.NotFoundException('Rule not found');
        if (role !== client_1.Role.ADMIN && rule.hotel.hostId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to delete this rule');
        }
        return this.prisma.pricingRule.delete({ where: { id } });
    }
};
exports.PricingRulesService = PricingRulesService;
exports.PricingRulesService = PricingRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingRulesService);
//# sourceMappingURL=pricing-rules.service.js.map