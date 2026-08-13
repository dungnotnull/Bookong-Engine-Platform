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
exports.PricingRulesController = void 0;
const common_1 = require("@nestjs/common");
const pricing_rules_service_1 = require("./pricing-rules.service");
const pricing_rule_dto_1 = require("./dto/pricing-rule.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const client_1 = require("@prisma/client");
let PricingRulesController = class PricingRulesController {
    pricingRulesService;
    constructor(pricingRulesService) {
        this.pricingRulesService = pricingRulesService;
    }
    async create(req, data) {
        const result = await this.pricingRulesService.create(req.user.userId, req.user.role, data);
        return { success: true, data: result };
    }
    async findAll(hotelId) {
        const results = await this.pricingRulesService.findAll(hotelId);
        return { success: true, data: results };
    }
    async update(id, req, data) {
        const result = await this.pricingRulesService.update(id, req.user.userId, req.user.role, data);
        return { success: true, data: result };
    }
    async remove(id, req) {
        await this.pricingRulesService.remove(id, req.user.userId, req.user.role);
        return { success: true, message: 'Pricing rule deleted' };
    }
};
exports.PricingRulesController = PricingRulesController;
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pricing_rule_dto_1.CreatePricingRuleDto]),
    __metadata("design:returntype", Promise)
], PricingRulesController.prototype, "create", null);
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hotelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingRulesController.prototype, "findAll", null);
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, pricing_rule_dto_1.UpdatePricingRuleDto]),
    __metadata("design:returntype", Promise)
], PricingRulesController.prototype, "update", null);
__decorate([
    (0, roles_guard_1.Roles)(client_1.Role.HOST, client_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PricingRulesController.prototype, "remove", null);
exports.PricingRulesController = PricingRulesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pricing-rules'),
    __metadata("design:paramtypes", [pricing_rules_service_1.PricingRulesService])
], PricingRulesController);
//# sourceMappingURL=pricing-rules.controller.js.map