import { injectable, inject } from "inversify";
import {
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

    const config = await this.fareConfigRepository.findActiveConfiguration(
      searchDate ?? new Date(),
    );

    if (!config) {
      throw new Error("No active fare configuration found");
    }

    const baseFareAmount = fareBreakdown.getBaseFare().getAmount();
    const maxCap = config.getMaxCancellationCharge();

    if (
      context.isBeforeMatch ||
      context.isWithinGracePeriod ||
      context.isDriverDelayed
    ) {
      return Money.create(0);
    }

    let fee = 0;

    if (context.isDriverArrived) {
      fee = this.calculateArrivedCancellation(
        baseFareAmount,
        context.waitTimeMinutes,
      );
    } else {
      fee = this.calculateEnRouteCancellation(baseFareAmount);
    }

    fee = Math.min(fee, maxCap);

    fee = Math.max(fee, this.MIN_FEE);

    Logger.info("Rider cancellation charge computed", {
      baseFareAmount,
      waitTimeMinutes: context.waitTimeMinutes,
      isDriverArrived: context.isDriverArrived,
      finalFee: fee,
      maxCap,
    });

    return Money.create(fee);
  }

  private calculateArrivedCancellation(
    baseFareAmount: number,
    waitTimeMinutes: number,
  ): number {
    if (waitTimeMinutes > 5) {
      return baseFareAmount * 0.6;
    }

    return baseFareAmount * 0.3;
  }

  private calculateEnRouteCancellation(baseFareAmount: number): number {
    return baseFareAmount * 0.15;
  }
}
