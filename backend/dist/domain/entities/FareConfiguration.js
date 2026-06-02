"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareConfiguration = void 0;
class FareConfiguration {
    constructor(id, baseAmount, baseHours, fareRules, platformFeePercentage, fareTaxPercentage, platformFeeTaxPercentage, isActive, effectiveFrom, effectiveTill, maxCancellationCharge, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.baseAmount = baseAmount;
        this.baseHours = baseHours;
        this.fareRules = fareRules;
        this.platformFeePercentage = platformFeePercentage;
        this.fareTaxPercentage = fareTaxPercentage;
        this.platformFeeTaxPercentage = platformFeeTaxPercentage;
        this.isActive = isActive;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTill = effectiveTill;
        this.maxCancellationCharge = maxCancellationCharge;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        // Validate and sort rules
        const sortedRules = [...params.fareRules].sort((a, b) => {
            if (a.maxHours === null)
                return 1;
            if (b.maxHours === null)
                return -1;
            return a.maxHours - b.maxHours;
        });
        return new FareConfiguration(params.id, params.baseAmount, params.baseHours, sortedRules, params.platformFeePercentage, params.fareTaxPercentage, params.platformFeeTaxPercentage, true, params.effectiveFrom, params.effectiveTill || null, params.maxCancellationCharge);
    }
    static fromData(data) {
        return new FareConfiguration(data.id, data.baseAmount, data.baseHours, data.fareRules, data.platformFeePercentage, data.fareTaxPercentage, data.platformFeeTaxPercentage, data.isActive, data.effectiveFrom, data.effectiveTill, data.maxCancellationCharge, data.createdAt, data.updatedAt);
    }
    getId() {
        return this.id;
    }
    getBaseAmount() {
        return this.baseAmount;
    }
    getBaseHours() {
        return this.baseHours;
    }
    getFareRules() {
        return [...this.fareRules];
    }
    getPlatformFeePercentage() {
        return this.platformFeePercentage;
    }
    getFareTaxPercentage() {
        return this.fareTaxPercentage;
    }
    getPlatformFeeTaxPercentage() {
        return this.platformFeeTaxPercentage;
    }
    getMaxCancellationCharge() {
        return this.maxCancellationCharge;
    }
    getEffectiveFrom() {
        return this.effectiveFrom;
    }
    getEffectiveTill() {
        return this.effectiveTill;
    }
    isActiveAt(date) {
        const isAfterStart = date >= this.effectiveFrom;
        const isBeforeEnd = !this.effectiveTill || date <= this.effectiveTill;
        return this.isActive && isAfterStart && isBeforeEnd;
    }
}
exports.FareConfiguration = FareConfiguration;
//# sourceMappingURL=FareConfiguration.js.map