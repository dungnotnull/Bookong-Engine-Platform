import { Module } from '@nestjs/common';
import { HostService } from './host.service';
import { HostController } from './host.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HostController],
  providers: [HostService],
})
export class HostModule {}
