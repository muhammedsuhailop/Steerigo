import { Money } from "@domain/value-objects/Money";
export interface DistributeEarningsParams {
    rideId: string;
    driverId: string;
    totalFare: Money;
    platformFee: Money;
    platformFeeTax: Money;
    payableAmount?: Money;
    discount?: Money;
    groupId?: string;
}
export interface DistributeCancellationParams {
    rideId: string;
    driverId: string;
    riderId: string;
    riderCharge: Money;
    driverPenalty: Money;
}
export interface EarningsDistributionResult {
    driverEarnings: number;
    platformRevenue: number;
    currency: string;
}
export interface IEarningsDistributionService {
    distribute(params: DistributeEarningsParams): Promise<EarningsDistributionResult>;
    distributeCashPayment(params: DistributeEarningsParams): Promise<void>;
    distributeCancellation(params: DistributeCancellationParams): Promise<void>;
}
//# sourceMappingURL=IEarningsDistributionService.d.ts.map