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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWishlist(userId) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: {
                hotel: true
            }
        });
    }
    async addWishlist(userId, data) {
        const exists = await this.prisma.wishlist.findUnique({
            where: {
                userId_hotelId: {
                    userId,
                    hotelId: data.hotelId
                }
            }
        });
        if (exists)
            throw new common_1.ConflictException('Hotel already in wishlist');
        return this.prisma.wishlist.create({
            data: {
                userId,
                hotelId: data.hotelId
            }
        });
    }
    async removeWishlist(userId, hotelId) {
        return this.prisma.wishlist.delete({
            where: {
                userId_hotelId: {
                    userId,
                    hotelId
                }
            }
        });
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map