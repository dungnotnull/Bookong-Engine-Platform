import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: SearchQueryDto): Promise<{
        success: boolean;
        data: unknown;
    }>;
}
