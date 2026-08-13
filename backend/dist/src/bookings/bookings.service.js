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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const uuid_1 = require("uuid");
let BookingsService = class BookingsService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async checkAvailability(roomId, checkIn, checkOut, guests) {
        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        if (room.capacity < guests)
            throw new common_1.BadRequestException('Room capacity is not enough');
        const overlappingBookings = await this.prisma.booking.count({
            where: {
                roomId,
                status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
                OR: [
                    { checkIn: { lt: checkOut }, checkOut: { gt: checkIn } }
                ]
            }
        });
        return (room.quantity - overlappingBookings) > 0;
    }
    async holdRoom(data) {
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);
        if (checkIn >= checkOut)
            throw new common_1.BadRequestException('Check-out must be after check-in');
        const isAvailable = await this.checkAvailability(data.roomId, checkIn, checkOut, data.guests);
        if (!isAvailable)
            throw new common_1.BadRequestException('Room is not available for these dates');
        const holdId = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.cacheManager.set(`hold:${holdId}`, {
            ...data,
            expiresAt,
        }, 15 * 60 * 1000);
        return { holdId, expiresAt };
    }
    async calculatePrice(data) {
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);
        if (checkIn >= checkOut)
            throw new common_1.BadRequestException('Check-out must be after check-in');
        const room = await this.prisma.room.findUnique({ where: { id: data.roomId }, include: { hotel: true } });
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        const pricingRules = await this.prisma.pricingRule.findMany({
            where: { hotelId: room.hotelId }
        });
        let basePriceTotal = 0;
        let surgeTotal = 0;
        let currentDate = new Date(checkIn);
        while (currentDate < checkOut) {
            let nightPrice = room.basePrice;
            let nightSurge = 0;
            const dayOfWeek = currentDate.getDay();
            const rule = pricingRules.find(r => (r.dayOfWeek === null || r.dayOfWeek === dayOfWeek) &&
                (!r.startDate || r.startDate <= currentDate) &&
                (!r.endDate || r.endDate >= currentDate));
            if (rule) {
                if (rule.multiplier)
                    nightSurge += (nightPrice * rule.multiplier) - nightPrice;
                if (rule.flatFee)
                    nightSurge += rule.flatFee;
            }
            basePriceTotal += nightPrice;
            surgeTotal += nightSurge;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        let discountAmount = 0;
        if (data.discountCode) {
            const coupon = await this.prisma.coupon.findUnique({ where: { code: data.discountCode } });
            if (coupon && (!coupon.expiryDate || coupon.expiryDate > new Date())) {
                const subtotal = basePriceTotal + surgeTotal;
                if (!coupon.minSpend || subtotal >= coupon.minSpend) {
                    if (coupon.discountType === 'PERCENTAGE') {
                        discountAmount = subtotal * (coupon.amount / 100);
                        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                            discountAmount = coupon.maxDiscount;
                        }
                    }
                    else {
                        discountAmount = coupon.amount;
                    }
                }
            }
        }
        return {
            basePrice: basePriceTotal,
            seasonalSurge: surgeTotal,
            discountAmount,
            totalAmount: Math.max(0, basePriceTotal + surgeTotal - discountAmount)
        };
    }
    async submitBooking(userId, data) {
        const holdData = await this.cacheManager.get(`hold:${data.holdId}`);
        if (!holdData)
            throw new common_1.BadRequestException('Hold expired or invalid');
        const checkIn = new Date(holdData.checkIn);
        const checkOut = new Date(holdData.checkOut);
        const priceBreakdown = await this.calculatePrice({
            roomId: holdData.roomId,
            checkIn: holdData.checkIn,
            checkOut: holdData.checkOut,
            guests: holdData.guests,
            discountCode: data.discountCode
        });
        return this.prisma.$transaction(async (tx) => {
            const room = await tx.room.findUnique({ where: { id: holdData.roomId } });
            const overlappingBookings = await tx.booking.count({
                where: {
                    roomId: holdData.roomId,
                    status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
                    OR: [
                        { checkIn: { lt: checkOut }, checkOut: { gt: checkIn } }
                    ]
                }
            });
            if (!room || (room.quantity - overlappingBookings) <= 0) {
                throw new common_1.BadRequestException('Room is no longer available');
            }
            const booking = await tx.booking.create({
                data: {
                    userId,
                    roomId: holdData.roomId,
                    checkIn,
                    checkOut,
                    guests: holdData.guests,
                    totalPrice: priceBreakdown.totalAmount,
                    status: 'CONFIRMED',
                    paymentMethod: data.paymentMethod
                }
            });
            await this.cacheManager.del(`hold:${data.holdId}`);
            return booking;
        });
    }
    async cancelBooking(bookingId, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { room: { include: { hotel: true } } }
        });
        if (!booking)
            throw new common_1.BadRequestException('Booking not found');
        if (booking.userId !== userId)
            throw new common_1.BadRequestException('Not your booking');
        if (booking.status === 'CANCELLED')
            throw new common_1.BadRequestException('Booking is already cancelled');
        if (booking.status === 'COMPLETED' || booking.status === 'CHECKED_OUT') {
            throw new common_1.BadRequestException('Cannot cancel past booking');
        }
        const now = new Date();
        if (now >= booking.checkIn) {
            throw new common_1.BadRequestException('Cannot cancel booking on or after check-in date');
        }
        const msBeforeCheckIn = booking.checkIn.getTime() - now.getTime();
        const daysBeforeCheckIn = Math.floor(msBeforeCheckIn / (1000 * 60 * 60 * 24));
        const policies = await this.prisma.cancellationPolicy.findMany({
            where: { hotelId: booking.room.hotelId },
            orderBy: { daysBeforeCheckIn: 'desc' }
        });
        let penaltyPercentage = 100;
        if (policies.length > 0) {
            penaltyPercentage = 100;
            for (const p of policies) {
                if (daysBeforeCheckIn >= p.daysBeforeCheckIn) {
                    penaltyPercentage = p.penaltyPercentage;
                    break;
                }
            }
        }
        else {
            penaltyPercentage = 0;
        }
        const penaltyAmount = booking.totalPrice * (penaltyPercentage / 100);
        const refundAmount = Math.max(0, booking.totalPrice - penaltyAmount);
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                refundAmount
            }
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map