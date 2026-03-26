import { injectable, inject } from "inversify";
import {
  DriverCancellationContext,
  DriverCancellationOutcome,
  ICancellationChargeService,
  RiderCancellationContext,
} from "@application/services/ICancellationChargeService";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
import { IFareConfigurationRepository } from "@domain/repositories/IFareConfigurationRepository";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class CancellationChargeService implements ICancellationChargeService {
  private readonly MIN_FEE = 30;
  private readonly DRIVER_WAIT_THRESHOLD_MINS = 5;
  private readonly MAX_DRIVER_PENALTY = 500;
  private readonly MIN_DRIVER_PENALTY = 100;

  constructor(
    @inject(TYPES.FareConfigurationRepository)
    private fareConfigRepository: IFareConfigurationRepository,
  ) {}

  async calculateRiderCancellationCharge(params: {
    fareBreakdown: FareBreakdown;
    context: RiderCancellationContext;
    searchDate?: Date;
  }): Promise<Money> {
    const { fareBreakdown, context, searchDate } = params;

    const config = await this.getRequiredConfig(searchDate);
    const baseFareAmount = fareBreakdown.getBaseFare().getAmount();

    if (
      context.isBeforeMatch ||
      context.isWithinGracePeriod ||
      context.isDriverDelayed
    ) {
      return Money.create(0);
    }

    let fee = context.isDriverArrived
      ? this.calculateArrivedCancellation(
          baseFareAmount,
          context.waitTimeMinutes,
        )
      : this.calculateEnRouteCancellation(baseFareAmount);

    fee = this.applyRiderFeeConstraints(fee, config.getMaxCancellationCharge());

    Logger.info("Rider cancellation charge computed", {
      baseFareAmount,
      finalFee: fee,
      context,
    });

    return Money.create(fee);
  }

  async calculateDriverCancellationOutcome(params: {
    fareBreakdown: FareBreakdown;
    context: DriverCancellationContext;
    searchDate?: Date;
  }): Promise<DriverCancellationOutcome> {
    const { fareBreakdown, context, searchDate } = params;

    const config = await this.getRequiredConfig(searchDate);
    const baseFareAmount = fareBreakdown.getBaseFare().getAmount();

    let riderCharge = 0;
    let driverPenalty = 0;

    if (context.isTripStarted) {
      riderCharge = 0;
      driverPenalty = Math.min(
        Math.max(baseFareAmount * 0.5, this.MIN_DRIVER_PENALTY),
        this.MAX_DRIVER_PENALTY,
      );
    } else if (!context.isDriverArrived) {
      driverPenalty = this.calculateDriverPenalty(baseFareAmount);
    } else if (context.waitTimeMinutes <= this.DRIVER_WAIT_THRESHOLD_MINS) {
      riderCharge = 0;
      driverPenalty = 0;
    } else {
      const rawCharge = this.calculateArrivedCancellation(
        baseFareAmount,
        context.waitTimeMinutes,
      );
      riderCharge = this.applyRiderFeeConstraints(
        rawCharge,
        config.getMaxCancellationCharge(),
      );
      driverPenalty = 0;
    }

    Logger.info("Driver cancellation outcome computed", {
      baseFareAmount,
      riderCharge,
      driverPenalty,
      context,
    });

    return {
      riderCharge: Money.create(riderCharge),
      driverPenalty: Money.create(driverPenalty),
    };
  }

  private async getRequiredConfig(date?: Date) {
    const config = await this.fareConfigRepository.findActiveConfiguration(
      date ?? new Date(),
    );
    if (!config) throw new Error("No active fare configuration found");
    return config;
  }

  private applyRiderFeeConstraints(amount: number, maxCap: number): number {
    if (amount <= 0) return 0;
    const capped = Math.min(amount, maxCap);
    return Math.max(capped, this.MIN_FEE);
  }

  private calculateArrivedCancellation(
    baseFare: number,
    waitTime: number,
  ): number {
    const rate = waitTime > this.DRIVER_WAIT_THRESHOLD_MINS ? 0.6 : 0.3;
    return baseFare * rate;
  }

  private calculateEnRouteCancellation(baseFare: number): number {
    return baseFare * 0.15;
  }

  private calculateDriverPenalty(baseFare: number): number {
    const penalty = baseFare * 0.1;
    return Math.min(penalty, this.MAX_DRIVER_PENALTY);
  }
}
