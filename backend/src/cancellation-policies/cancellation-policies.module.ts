import { Module } from '@nestjs/common';
import { CancellationPoliciesService } from './cancellation-policies.service';
import { CancellationPoliciesController } from './cancellation-policies.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CancellationPoliciesController],
  providers: [CancellationPoliciesService],
})
export class CancellationPoliciesModule {}
