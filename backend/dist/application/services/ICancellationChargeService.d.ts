import { FareBreakdown } from "../../domain/value-objects/FareBreakdown";
import { Money } from "../../domain/value-objects/Money";
export interface RiderCancellationContext {
    isBeforeMatch: boolean;
    isWithinGracePeriod: boolean;
    isDriverArrived: boolean;
    waitTimeMinutes: number;
    isDriverDelayed: boolean;
}
export interface DriverCancellationContext {
    isDriverArrived: boolean;
    isTripStarted: boolean;
    waitTimeMinutes: number;
}
export interface DriverCancellationOutcome {
    riderCharge: Money;
    driverPenalty: Money;
}
export interface ICancellationChargeService {
    calculateRiderCancellationCharge(params: {
        fareBreakdown: FareBreakdown;
        context: RiderCancellationContext;
        searchDate?: Date;
    }): Promise<Money>;
    calculateDriverCancellationOutcome(params: {
        fareBreakdown: FareBreakdown;
        context: DriverCancellationContext;
        searchDate?: Date;
    }): Promise<DriverCancellationOutcome>;
}
//# sourceMappingURL=ICancellationChargeService.d.ts.map