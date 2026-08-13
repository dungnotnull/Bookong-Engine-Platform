export declare class CreatePricingRuleDto {
    hotelId: string;
    name: string;
    multiplier?: number;
    flatFee?: number;
    startDate?: string;
    endDate?: string;
    dayOfWeek?: number;
}
export declare class UpdatePricingRuleDto extends CreatePricingRuleDto {
}
