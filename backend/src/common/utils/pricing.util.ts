import { PricingRule } from '@prisma/client';

export function calculateDynamicNightlyPrice(
  basePrice: number,
  pricingRules: PricingRule[],
  checkIn: Date,
  checkOut: Date
): number {
  if (!pricingRules || pricingRules.length === 0) {
    return basePrice;
  }

  // Ensure dates are valid
  const ci = new Date(checkIn);
  ci.setHours(0, 0, 0, 0);
  
  const co = new Date(checkOut);
  co.setHours(0, 0, 0, 0);

  if (isNaN(ci.getTime()) || isNaN(co.getTime()) || ci >= co) {
    return basePrice;
  }

  let totalBasePrice = 0;
  let totalSurge = 0;
  let nights = 0;

  let currentDate = new Date(ci);
  while (currentDate < co) {
    nights++;
    let nightSurge = 0;

    const dayOfWeek = currentDate.getDay();
    const rule = pricingRules.find(r => 
      (r.dayOfWeek === null || r.dayOfWeek === dayOfWeek) &&
      (!r.startDate || new Date(r.startDate) <= currentDate) &&
      (!r.endDate || new Date(r.endDate) >= currentDate)
    );

    if (rule) {
      if (rule.multiplier) nightSurge += (basePrice * rule.multiplier) - basePrice;
      if (rule.flatFee) nightSurge += rule.flatFee;
    }

    totalBasePrice += basePrice;
    totalSurge += nightSurge;
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (nights === 0) return basePrice;

  // Return the average nightly price so the frontend can multiply it by number of nights
  return (totalBasePrice + totalSurge) / nights;
}
