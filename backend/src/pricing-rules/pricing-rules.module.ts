import { Module } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import { PricingRulesController } from './pricing-rules.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PricingRulesController],
  providers: [PricingRulesService],
})
export class PricingRulesModule {}
