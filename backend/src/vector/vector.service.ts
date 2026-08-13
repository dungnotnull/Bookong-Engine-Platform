import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VectorService {
  private readonly logger = new Logger(VectorService.name);
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('PYTHON_VECTOR_API_URL') || 'http://localhost:8000';
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/embed`, { text }),
      );
      return response.data.vector;
    } catch (error) {
      this.logger.error('Failed to get embedding from Python service', error);
      throw error;
    }
  }
}
