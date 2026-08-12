import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

import { PrismaModule } from '../prisma/prisma.module';
import { VectorModule } from '../vector/vector.module';

@Module({
  imports: [PrismaModule, VectorModule],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
