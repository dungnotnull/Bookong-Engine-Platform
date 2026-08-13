import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VectorModule } from '../vector/vector.module';

@Module({
  imports: [PrismaModule, VectorModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
