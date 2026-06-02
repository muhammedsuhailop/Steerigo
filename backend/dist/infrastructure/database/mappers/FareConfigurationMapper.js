"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareConfigurationMapper = void 0;
const FareConfiguration_1 = require("@domain/entities/FareConfiguration");
const mongoose_1 = require("mongoose");
class FareConfigurationMapper {
    static toDomain(doc) {
        return FareConfiguration_1.FareConfiguration.fromData({
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
            maxCancellationCharge: doc.maxCancellationCharge,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(config) {
        return {
            _id: new mongoose_1.Types.ObjectId(config.getId()),
            baseAmount: config.getBaseAmount(),
            baseHours: config.getBaseHours(),
            fareRules: config.getFareRules(),
            platformFeePercentage: config.getPlatformFeePercentage(),
            fareTaxPercentage: config.getFareTaxPercentage(),
            platformFeeTaxPercentage: config.getPlatformFeeTaxPercentage(),
            isActive: config.isActiveAt(new Date()),
            effectiveFrom: config.getEffectiveFrom(),
            effectiveTill: config.getEffectiveTill(),
            maxCancellationCharge: config.getMaxCancellationCharge(),
            updatedAt: new Date(),
        };
    }
}
exports.FareConfigurationMapper = FareConfigurationMapper;
//# sourceMappingURL=FareConfigurationMapper.js.map