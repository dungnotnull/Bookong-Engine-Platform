import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class VectorService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly apiUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getEmbedding(text: string): Promise<number[]>;
}
