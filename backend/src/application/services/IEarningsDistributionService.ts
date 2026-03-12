import { Money } from "@domain/value-objects/Money";

export interface DistributeEarningsParams {
  rideId: string;
  driverId: string;
  totalFare: Money;
  platformFee: Money;
  platformFeeTax: Money;
}

export interface EarningsDistributionResult {
  driverEarnings: number;
  platformRevenue: number;
  currency: string;
}

export interface IEarningsDistributionService {
  distribute(
    params: DistributeEarningsParams,
  ): Promise<EarningsDistributionResult>;
}
