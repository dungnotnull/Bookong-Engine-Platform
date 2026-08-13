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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const booking_dto_1 = require("./dto/booking.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async holdRoom(data) {
        const result = await this.bookingsService.holdRoom(data);
        return { success: true, data: result };
    }
    async calculatePrice(data) {
        const result = await this.bookingsService.calculatePrice(data);
        return { success: true, data: result };
    }
    async submitBooking(req, data) {
        const result = await this.bookingsService.submitBooking(req.user.userId, data);
        return { success: true, data: result };
    }
    async cancelBooking(req, id) {
        const result = await this.bookingsService.cancelBooking(id, req.user.userId);
        return { success: true, data: result };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('hold'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.HoldRoomDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "holdRoom", null);
__decorate([
    (0, common_1.Post)('calculate-price'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.CalculatePriceDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "calculatePrice", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, booking_dto_1.SubmitBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "submitBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map