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
exports.HostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HostService = class HostService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBookings(userId) {
        return this.prisma.booking.findMany({
            where: {
                room: {
                    hotel: {
                        hostId: userId
                    }
                }
            },
            include: {
                room: true,
                user: { select: { id: true, email: true, fullName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateBookingStatus(bookingId, userId, data) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { room: { include: { hotel: true } } }
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.room.hotel.hostId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to update this booking');
        }
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: data.status }
        });
    }
    async getRevenue(userId, query) {
        const hotel = await this.prisma.hotel.findUnique({ where: { id: query.hotelId } });
        if (!hotel || hotel.hostId !== userId) {
            throw new common_1.ForbiddenException('Not your hotel');
        }
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);
        const result = await this.prisma.booking.aggregate({
            _sum: { totalPrice: true },
            where: {
                room: { hotelId: query.hotelId },
                status: { in: ['CONFIRMED', 'COMPLETED', 'CHECKED_OUT'] },
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return { totalRevenue: result._sum.totalPrice || 0 };
    }
    async getOccupancy(userId, query) {
        const hotel = await this.prisma.hotel.findUnique({ where: { id: query.hotelId } });
        if (!hotel || hotel.hostId !== userId) {
            throw new common_1.ForbiddenException('Not your hotel');
        }
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);
        const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const rooms = await this.prisma.room.findMany({ where: { hotelId: query.hotelId } });
        let totalRoomNights = 0;
        for (const r of rooms) {
            totalRoomNights += (r.quantity * totalDays);
        }
        if (totalRoomNights === 0)
            return { occupancyRate: 0, bookedNights: 0, totalRoomNights: 0 };
        const bookings = await this.prisma.booking.findMany({
            where: {
                room: { hotelId: query.hotelId },
                status: { in: ['CONFIRMED', 'COMPLETED', 'CHECKED_IN', 'CHECKED_OUT'] },
                checkIn: { lt: endDate },
                checkOut: { gt: startDate }
            }
        });
        let bookedNights = 0;
        for (const b of bookings) {
            const start = b.checkIn > startDate ? b.checkIn : startDate;
            const end = b.checkOut < endDate ? b.checkOut : endDate;
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            bookedNights += days;
        }
        return {
            occupancyRate: (bookedNights / totalRoomNights) * 100,
            bookedNights,
            totalRoomNights
        };
    }
};
exports.HostService = HostService;
exports.HostService = HostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HostService);
//# sourceMappingURL=host.service.js.map