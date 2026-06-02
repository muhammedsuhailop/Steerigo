"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFareCalculationService = void 0;
const inversify_1 = require("inversify");
const FareBreakdown_1 = require("@domain/value-objects/FareBreakdown");
const Money_1 = require("@domain/value-objects/Money");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
let IFareCalculationService = class IFareCalculationService {
    constructor(fareConfigRepository) {
        this.fareConfigRepository = fareConfigRepository;
    }
    async calculateFare(params) {
        const searchDate = params.searchDate || new Date();
        // Get active fare configuration
        const config = await this.fareConfigRepository.findActiveConfiguration(searchDate);
        if (!config) {
            throw new Error("No active fare configuration found");
        }
        const durationHours = params.durationMinutes / 60;
        // Calculate base fare using tiered rules
        const baseFareAmount = this.calculateBaseFare(config, durationHours);
        const baseFare = Money_1.Money.create(baseFareAmount);
        Logger_1.Logger.info("Base fare calculated", {
            durationHours,
            baseFareAmount,
            baseAmount: config.getBaseAmount(),
            baseHours: config.getBaseHours(),
        });
        // Calculate platform fee (2% of base fare)
        const platformFeeAmount = baseFareAmount * (config.getPlatformFeePercentage() / 100);
        const platformFee = Money_1.Money.create(platformFeeAmount);
        // Calculate taxes
        const fareTaxAmount = baseFareAmount * (config.getFareTaxPercentage() / 100);
        const fareTax = {
            name: "GST on Fare",
            rate: config.getFareTaxPercentage(),
            amount: Money_1.Money.create(fareTaxAmount),
        };
        const platformFeeTaxAmount = platformFeeAmount * (config.getPlatformFeeTaxPercentage() / 100);
        const platformFeeTax = {
            name: "GST on Platform Fee",
            rate: config.getPlatformFeeTaxPercentage(),
            amount: Money_1.Money.create(platformFeeTaxAmount),
        };
        // Calculate total
        const totalAmount = baseFareAmount + platformFeeAmount + fareTaxAmount + platformFeeTaxAmount;
        const totalFare = Money_1.Money.create(totalAmount);
        Logger_1.Logger.info("Fare calculation completed", {
            baseFare: baseFareAmount,
            platformFee: platformFeeAmount,
            fareTax: fareTaxAmount,
            platformFeeTax: platformFeeTaxAmount,
            total: totalAmount,
        });
        return FareBreakdown_1.FareBreakdown.create({
            baseFare,
            platformFee,
            fareTax,
            platformFeeTax,
            totalFare,
            durationHours,
        });
    }
    calculateBaseFare(config, durationHours) {
        const baseHours = config.getBaseHours();
        const baseAmount = config.getBaseAmount();
        // If within base hours, return base amount
        if (durationHours <= baseHours) {
            return baseAmount;
        }
        let totalFare = baseAmount;
        let remainingHours = durationHours - baseHours;
        const rules = config.getFareRules();
        // Apply tiered pricing rules
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.maxHours === null) {
                // Unlimited hours rule (last tier)
                totalFare += remainingHours * rule.ratePerHour;
                break;
            }
            const tierMaxHours = rule.maxHours - baseHours;
            const previousTierHours = i > 0 ? (rules[i - 1].maxHours || 0) - baseHours : 0;
            const tierHours = tierMaxHours - previousTierHours;
            if (remainingHours <= tierHours) {
                totalFare += remainingHours * rule.ratePerHour;
                break;
            }
            else {
                totalFare += tierHours * rule.ratePerHour;
                remainingHours -= tierHours;
            }
        }
        return totalFare;
    }
};
exports.IFareCalculationService = IFareCalculationService;
exports.IFareCalculationService = IFareCalculationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FareConfigurationRepository)),
    __metadata("design:paramtypes", [Object])
], IFareCalculationService);
//# sourceMappingURL=IFareCalculationService1.js.map