"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
const amenities_module_1 = require("./amenities/amenities.module");
const hotels_module_1 = require("./hotels/hotels.module");
const rooms_module_1 = require("./rooms/rooms.module");
const vector_module_1 = require("./vector/vector.module");
const admin_module_1 = require("./admin/admin.module");
const search_module_1 = require("./search/search.module");
const bookings_module_1 = require("./bookings/bookings.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const coupons_module_1 = require("./coupons/coupons.module");
const pricing_rules_module_1 = require("./pricing-rules/pricing-rules.module");
const cancellation_policies_module_1 = require("./cancellation-policies/cancellation-policies.module");
const host_module_1 = require("./host/host.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            prisma_module_1.PrismaModule,
            amenities_module_1.AmenitiesModule,
            hotels_module_1.HotelsModule,
            rooms_module_1.RoomsModule,
            vector_module_1.VectorModule,
            admin_module_1.AdminModule,
            search_module_1.SearchModule,
            bookings_module_1.BookingsModule,
            wishlist_module_1.WishlistModule,
            coupons_module_1.CouponsModule,
            pricing_rules_module_1.PricingRulesModule,
            cancellation_policies_module_1.CancellationPoliciesModule,
            host_module_1.HostModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map