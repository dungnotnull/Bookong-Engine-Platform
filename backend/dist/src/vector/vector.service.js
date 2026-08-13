"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VectorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let VectorService = VectorService_1 = class VectorService {
    httpService;
    configService;
    logger = new common_1.Logger(VectorService_1.name);
    apiUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.apiUrl = this.configService.get('PYTHON_VECTOR_API_URL') || 'http://localhost:8000';
    }
    async getEmbedding(text) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.apiUrl}/embed`, { text }));
            return response.data.vector;
        }
        catch (error) {
            this.logger.error('Failed to get embedding from Python service', error);
            throw error;
        }
    }
};
exports.VectorService = VectorService;
exports.VectorService = VectorService = VectorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], VectorService);
//# sourceMappingURL=vector.service.js.map