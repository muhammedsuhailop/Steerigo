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
exports.CancellationChargeService = void 0;
const inversify_1 = require("inversify");
const Money_1 = require("@domain/value-objects/Money");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
let CancellationChargeService = class CancellationChargeService {
    constructor(fareConfigRepository) {
        this.fareConfigRepository = fareConfigRepository;
        this.MIN_FEE = 30;
        this.DRIVER_WAIT_THRESHOLD_MINS = 5;
        this.MAX_DRIVER_PENALTY = 500;
        this.MIN_DRIVER_PENALTY = 100;
    }
    async calculateRiderCancellationCharge(params) {
        const { fareBreakdown, context, searchDate } = params;
        const config = await this.getRequiredConfig(searchDate);
        const baseFareAmount = fareBreakdown.getBaseFare().getAmount();
        if (context.isBeforeMatch ||
            context.isWithinGracePeriod ||
            context.isDriverDelayed) {
            return Money_1.Money.create(0);
        }
        let fee = context.isDriverArrived
            ? this.calculateArrivedCancellation(baseFareAmount, context.waitTimeMinutes)
            : this.calculateEnRouteCancellation(baseFareAmount);
        fee = this.applyRiderFeeConstraints(fee, config.getMaxCancellationCharge());
        Logger_1.Logger.info("Rider cancellation charge computed", {
            baseFareAmount,
            finalFee: fee,
            context,
        });
        return Money_1.Money.create(fee);
    }
    async calculateDriverCancellationOutcome(params) {
        const { fareBreakdown, context, searchDate } = params;
        const config = await this.getRequiredConfig(searchDate);
        const baseFareAmount = fareBreakdown.getBaseFare().getAmount();
        let riderCharge = 0;
        let driverPenalty = 0;
        if (context.isTripStarted) {
            riderCharge = 0;
            driverPenalty = Math.min(Math.max(baseFareAmount * 0.5, this.MIN_DRIVER_PENALTY), this.MAX_DRIVER_PENALTY);
        }
        else if (!context.isDriverArrived) {
            driverPenalty = this.calculateDriverPenalty(baseFareAmount);
        }
        else if (context.waitTimeMinutes <= this.DRIVER_WAIT_THRESHOLD_MINS) {
            riderCharge = 0;
            driverPenalty = 0;
        }
        else {
            const rawCharge = this.calculateArrivedCancellation(baseFareAmount, context.waitTimeMinutes);
            riderCharge = this.applyRiderFeeConstraints(rawCharge, config.getMaxCancellationCharge());
            driverPenalty = 0;
        }
        Logger_1.Logger.info("Driver cancellation outcome computed", {
            baseFareAmount,
            riderCharge,
            driverPenalty,
            context,
        });
        return {
            riderCharge: Money_1.Money.create(riderCharge),
            driverPenalty: Money_1.Money.create(driverPenalty),
        };
    }
    async getRequiredConfig(date) {
        const config = await this.fareConfigRepository.findActiveConfiguration(date ?? new Date());
        if (!config)
            throw new Error("No active fare configuration found");
        return config;
    }
    applyRiderFeeConstraints(amount, maxCap) {
        if (amount <= 0)
            return 0;
        const capped = Math.min(amount, maxCap);
        return Math.max(capped, this.MIN_FEE);
    }
    calculateArrivedCancellation(baseFare, waitTime) {
        const rate = waitTime > this.DRIVER_WAIT_THRESHOLD_MINS ? 0.6 : 0.3;
        return baseFare * rate;
    }
    calculateEnRouteCancellation(baseFare) {
        return baseFare * 0.15;
    }
    calculateDriverPenalty(baseFare) {
        const penalty = baseFare * 0.1;
        return Math.min(penalty, this.MAX_DRIVER_PENALTY);
    }
};
exports.CancellationChargeService = CancellationChargeService;
exports.CancellationChargeService = CancellationChargeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FareConfigurationRepository)),
    __metadata("design:paramtypes", [Object])
], CancellationChargeService);
//# sourceMappingURL=CancellationChargeService.js.map