import { FareConfiguration } from "@domain/entities/FareConfiguration";
import { IFareConfigurationDocument } from "../models/FareConfigurationModel";

export class FareConfigurationMapper {
  static toDomain(doc: IFareConfigurationDocument): FareConfiguration {
    return FareConfiguration.fromData({
      id: doc.id.toString(),
      baseAmount: doc.baseAmount,
      baseHours: doc.baseHours,
      fareRules: doc.fareRules,
      platformFeePercentage: doc.platformFeePercentage,
      fareTaxPercentage: doc.fareTaxPercentage,
      platformFeeTaxPercentage: doc.platformFeeTaxPercentage,
      isActive: doc.isActive,
      effectiveFrom: doc.effectiveFrom,
      effectiveTill: doc.effectiveTill,
      maxCancellationCharge:doc.maxCancellationCharge,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(
    config: FareConfiguration
  ): Partial<IFareConfigurationDocument> {
    return {
      _id: config.getId(),
      baseAmount: config.getBaseAmount(),
      baseHours: config.getBaseHours(),
      fareRules: config.getFareRules(),
      platformFeePercentage: config.getPlatformFeePercentage(),
      fareTaxPercentage: config.getFareTaxPercentage(),
      platformFeeTaxPercentage: config.getPlatformFeeTaxPercentage(),
      isActive: config.isActiveAt(new Date()),
      effectiveFrom: config.getEffectiveFrom(),
      effectiveTill: config.getEffectiveTill(),
      maxCancellationCharge:config.getMaxCancellationCharge(),
      updatedAt: new Date(),
    };
  }
}
