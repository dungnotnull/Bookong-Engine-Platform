import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { SearchQueryDto } from './dto/search.dto';
export declare class SearchService {
    private readonly prisma;
    private readonly vectorService;
    constructor(prisma: PrismaService, vectorService: VectorService);
    search(query: SearchQueryDto): Promise<unknown>;
}
