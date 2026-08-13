import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { VectorModule } from './vector/vector.module';
import { AdminModule } from './admin/admin.module';
import { SearchModule } from './search/search.module';
import { BookingsModule } from './bookings/bookings.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';
import { PricingRulesModule } from './pricing-rules/pricing-rules.module';
import { CancellationPoliciesModule } from './cancellation-policies/cancellation-policies.module';
import { HostModule } from './host/host.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    AmenitiesModule,
    HotelsModule,
    RoomsModule,
    VectorModule,
    AdminModule,
    SearchModule,
    BookingsModule,
    WishlistModule,
    CouponsModule,
    PricingRulesModule,
    CancellationPoliciesModule,
    HostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
