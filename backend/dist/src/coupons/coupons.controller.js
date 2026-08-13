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
exports.CouponsController = void 0;
const common_1 = require("@nestjs/common");
const coupons_service_1 = require("./coupons.service");
const coupon_dto_1 = require("./dto/coupon.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const client_1 = require("@prisma/client");
let CouponsController = class CouponsController {
    couponsService;
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async create(req, data) {
        const result = await this.couponsService.create(req.user.userId, req.user.role, data);
        return { success: true, data: result };
    }
    async findAll(req) {
        const results = await this.couponsService.findAll(req.user.userId, req.user.role);
        return { success: true, data: results };
    }
    async update(id, req, data) {
        const result = await this.couponsService.update(id, req.user.userId, req.user.role, data);
        return { success: true, data: result };
    }
    async remove(id, req) {
        await this.couponsService.remove(id, req.user.userId, req.user.role);
        return { success: true, message: 'Coupon deleted' };
    }
};
exports.CouponsController = CouponsController;
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "create", null);
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findAll", null);
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, coupon_dto_1.UpdateCouponDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "update", null);
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "remove", null);
exports.CouponsController = CouponsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService])
], CouponsController);
//# sourceMappingURL=coupons.controller.js.map