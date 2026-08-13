export declare class CreateCancellationPolicyDto {
    hotelId: string;
    daysBeforeCheckIn: number;
    penaltyPercentage: number;
}
export declare class UpdateCancellationPolicyDto {
    daysBeforeCheckIn?: number;
    penaltyPercentage?: number;
}
