import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";

export interface RiderCancellationContext {
  isBeforeMatch: boolean;
  isWithinGracePeriod: boolean;
  isDriverArrived: boolean;
  waitTimeMinutes: number;
  isDriverDelayed: boolean;
}

export interface ICancellationChargeService {
  calculateRiderCancellationCharge(params: {
    fareBreakdown: FareBreakdown;
    context: RiderCancellationContext;
    searchDate?: Date;
  }): Promise<Money>;
}
