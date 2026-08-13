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
exports.HostController = void 0;
const common_1 = require("@nestjs/common");
const host_service_1 = require("./host.service");
const host_dto_1 = require("./dto/host.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const client_1 = require("@prisma/client");
let HostController = class HostController {
    hostService;
    constructor(hostService) {
        this.hostService = hostService;
    }
    async getBookings(req) {
        const results = await this.hostService.getBookings(req.user.userId);
        return { success: true, data: results };
    }
    async updateBookingStatus(id, req, data) {
        const result = await this.hostService.updateBookingStatus(id, req.user.userId, data);
        return { success: true, data: result };
    }
    async getRevenue(req, query) {
        const result = await this.hostService.getRevenue(req.user.userId, query);
        return { success: true, data: result };
    }
    async getOccupancy(req, query) {
        const result = await this.hostService.getOccupancy(req.user.userId, query);
        return { success: true, data: result };
    }
};
exports.HostController = HostController;
__decorate([
    (0, common_1.Get)('bookings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, host_dto_1.UpdateBookingStatusDto]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Get)('analytics/revenue'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, host_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('analytics/occupancy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, host_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "getOccupancy", null);
exports.HostController = HostController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.HOST),
    (0, common_1.Controller)('host'),
    __metadata("design:paramtypes", [host_service_1.HostService])
], HostController);
//# sourceMappingURL=host.controller.js.map