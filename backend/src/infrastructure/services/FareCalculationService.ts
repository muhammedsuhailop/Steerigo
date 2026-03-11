import { injectable, inject } from "inversify";
import {
  IFareCalculationService,
  IFareCalculationParams,
} from "@application/services/IFareCalculationService";
import { FareConfiguration } from "@domain/entities/FareConfiguration";
import {
  FareBreakdown,
  TaxBreakdown,
} from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
import { IFareConfigurationRepository } from "@domain/repositories/IFareConfigurationRepository";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class FareCalculationService implements IFareCalculationService {
  constructor(
    @inject(TYPES.FareConfigurationRepository)
    private fareConfigRepository: IFareConfigurationRepository,
  ) {}

  async calculateFare(params: IFareCalculationParams): Promise<FareBreakdown> {
    const searchDate = params.searchDate ?? new Date();

    const config =
      await this.fareConfigRepository.findActiveConfiguration(searchDate);
    if (!config) {
      throw new Error("No active fare configuration found");
    }

    const durationHours = params.durationMinutes / 60;

    const baseFareAmount = this.calculateBaseFare(config, durationHours);
    const baseFare = Money.create(baseFareAmount);

    Logger.info("Base fare calculated", {
      durationHours,
      baseFareAmount,
      baseAmount: config.getBaseAmount(),
      baseHours: config.getBaseHours(),
    });

    const platformFeeAmount =
      baseFareAmount * (config.getPlatformFeePercentage() / 100);
    const platformFee = Money.create(platformFeeAmount);

    const fareTaxAmount =
      baseFareAmount * (config.getFareTaxPercentage() / 100);
    const fareTax: TaxBreakdown = {
      name: "GST on Fare",
      rate: config.getFareTaxPercentage(),
      amount: Money.create(fareTaxAmount),
    };

    const platformFeeTaxAmount =
      platformFeeAmount * (config.getPlatformFeeTaxPercentage() / 100);
    const platformFeeTax: TaxBreakdown = {
      name: "GST on Platform Fee",
      rate: config.getPlatformFeeTaxPercentage(),
      amount: Money.create(platformFeeTaxAmount),
    };

    const totalAmount =
      baseFareAmount + platformFeeAmount + fareTaxAmount + platformFeeTaxAmount;
    const totalFare = Money.create(totalAmount);

    Logger.info("Fare calculation completed", {
      durationMinutes: params.durationMinutes,
      durationHours,
      baseFare: baseFareAmount,
      platformFee: platformFeeAmount,
      fareTax: fareTaxAmount,
      platformFeeTax: platformFeeTaxAmount,
      total: totalAmount,
    });

    return FareBreakdown.create({
      baseFare,
      platformFee,
      fareTax,
      platformFeeTax,
      totalFare,
      durationHours,
    });
  }

  private calculateBaseFare(
    config: FareConfiguration,
    durationHours: number,
  ): number {
    const baseHours = config.getBaseHours();
    const baseAmount = config.getBaseAmount();

    if (durationHours <= baseHours) {
      return baseAmount;
    }

    let totalFare = baseAmount;
    let remainingHours = durationHours - baseHours;
    const rules = config.getFareRules();

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];

      if (rule.maxHours === null) {
        // Unlimited hours — final tier
        totalFare += remainingHours * rule.ratePerHour;
        break;
      }

      const tierMaxHours = rule.maxHours - baseHours;
      const previousTierHours =
        i > 0 ? (rules[i - 1].maxHours ?? 0) - baseHours : 0;
      const tierHours = tierMaxHours - previousTierHours;

      if (remainingHours <= tierHours) {
        totalFare += remainingHours * rule.ratePerHour;
        break;
      } else {
        totalFare += tierHours * rule.ratePerHour;
        remainingHours -= tierHours;
      }
    }

    return totalFare;
  }
}
