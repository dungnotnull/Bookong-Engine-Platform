import { CancellationPoliciesService } from './cancellation-policies.service';
import { CreateCancellationPolicyDto, UpdateCancellationPolicyDto } from './dto/cancellation-policy.dto';
export declare class CancellationPoliciesController {
    private readonly policiesService;
    constructor(policiesService: CancellationPoliciesService);
    create(req: any, data: CreateCancellationPolicyDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            hotelId: string;
            daysBeforeCheckIn: number;
            penaltyPercentage: number;
        };
    }>;
    findAll(hotelId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            hotelId: string;
            daysBeforeCheckIn: number;
            penaltyPercentage: number;
        }[];
    }>;
    update(id: string, req: any, data: UpdateCancellationPolicyDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            hotelId: string;
            daysBeforeCheckIn: number;
            penaltyPercentage: number;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
