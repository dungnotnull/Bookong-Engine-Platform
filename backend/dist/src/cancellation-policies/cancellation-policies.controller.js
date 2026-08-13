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
exports.CancellationPoliciesController = void 0;
const common_1 = require("@nestjs/common");
const cancellation_policies_service_1 = require("./cancellation-policies.service");
const cancellation_policy_dto_1 = require("./dto/cancellation-policy.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const client_1 = require("@prisma/client");
let CancellationPoliciesController = class CancellationPoliciesController {
    policiesService;
    constructor(policiesService) {
        this.policiesService = policiesService;
    }
    async create(req, data) {
        const result = await this.policiesService.create(req.user.userId, req.user.role, data);
        return { success: true, data: result };
    }
    async findAll(hotelId) {
        const results = await this.policiesService.findAll(hotelId);
        return { success: true, data: results };
    }
    async update(id, req, data) {
        const result = await this.policiesService.update(id, req.user.userId, req.user.role, data);
        return { success: true, data: result };
    }
    async remove(id, req) {
        await this.policiesService.remove(id, req.user.userId, req.user.role);
        return { success: true, message: 'Policy deleted' };
    }
};
exports.CancellationPoliciesController = CancellationPoliciesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cancellation_policy_dto_1.CreateCancellationPolicyDto]),
    __metadata("design:returntype", Promise)
], CancellationPoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hotelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancellationPoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, cancellation_policy_dto_1.UpdateCancellationPolicyDto]),
    __metadata("design:returntype", Promise)
], CancellationPoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CancellationPoliciesController.prototype, "remove", null);
exports.CancellationPoliciesController = CancellationPoliciesController = __decorate([
    (0, common_1.Controller)('cancellation-policies'),
    __metadata("design:paramtypes", [cancellation_policies_service_1.CancellationPoliciesService])
], CancellationPoliciesController);
//# sourceMappingURL=cancellation-policies.controller.js.map