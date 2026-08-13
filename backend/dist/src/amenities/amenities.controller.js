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
exports.AmenitiesController = void 0;
const common_1 = require("@nestjs/common");
const amenities_service_1 = require("./amenities.service");
const amenity_dto_1 = require("./dto/amenity.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const client_1 = require("@prisma/client");
let AmenitiesController = class AmenitiesController {
    amenitiesService;
    constructor(amenitiesService) {
        this.amenitiesService = amenitiesService;
    }
    create(createAmenityDto) {
        return this.amenitiesService.create(createAmenityDto);
    }
    findAll() {
        return this.amenitiesService.findAll();
    }
    update(id, updateAmenityDto) {
        return this.amenitiesService.update(id, updateAmenityDto);
    }
    remove(id) {
        return this.amenitiesService.remove(id);
    }
};
exports.AmenitiesController = AmenitiesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN, client_1.Role.HOST),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [amenity_dto_1.CreateAmenityDto]),
    __metadata("design:returntype", void 0)
], AmenitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AmenitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN, client_1.Role.HOST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, amenity_dto_1.UpdateAmenityDto]),
    __metadata("design:returntype", void 0)
], AmenitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AmenitiesController.prototype, "remove", null);
exports.AmenitiesController = AmenitiesController = __decorate([
    (0, common_1.Controller)('amenities'),
    __metadata("design:paramtypes", [amenities_service_1.AmenitiesService])
], AmenitiesController);
//# sourceMappingURL=amenities.controller.js.map