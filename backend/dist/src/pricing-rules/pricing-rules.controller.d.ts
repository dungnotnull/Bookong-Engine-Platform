import { PricingRulesService } from './pricing-rules.service';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './dto/pricing-rule.dto';
export declare class PricingRulesController {
    private readonly pricingRulesService;
    constructor(pricingRulesService: PricingRulesService);
    create(req: any, data: CreatePricingRuleDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            hotelId: string;
            multiplier: number | null;
            flatFee: number | null;
            startDate: Date | null;
            endDate: Date | null;
            dayOfWeek: number | null;
        };
    }>;
    findAll(hotelId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            hotelId: string;
            multiplier: number | null;
            flatFee: number | null;
            startDate: Date | null;
            endDate: Date | null;
            dayOfWeek: number | null;
        }[];
    }>;
    update(id: string, req: any, data: UpdatePricingRuleDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            hotelId: string;
            multiplier: number | null;
            flatFee: number | null;
            startDate: Date | null;
            endDate: Date | null;
            dayOfWeek: number | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
