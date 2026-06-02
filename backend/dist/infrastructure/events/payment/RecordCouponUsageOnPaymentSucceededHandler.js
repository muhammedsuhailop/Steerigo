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
exports.RecordCouponUsageOnPaymentSucceededHandler = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
let RecordCouponUsageOnPaymentSucceededHandler = class RecordCouponUsageOnPaymentSucceededHandler {
    constructor(eventBus, couponUsageService) {
        this.eventBus = eventBus;
        this.couponUsageService = couponUsageService;
        this.eventBus.subscribe("PaymentSucceeded", this);
    }
    async handle(event) {
        try {
            await this.couponUsageService.recordUsage(event.payload.rideId);
        }
        catch (error) {
            Logger_1.Logger.error("Failed to record coupon usage for PaymentSucceeded", {
                rideId: event.payload.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
};
exports.RecordCouponUsageOnPaymentSucceededHandler = RecordCouponUsageOnPaymentSucceededHandler;
exports.RecordCouponUsageOnPaymentSucceededHandler = RecordCouponUsageOnPaymentSucceededHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.CouponUsageService)),
    __metadata("design:paramtypes", [Object, Object])
], RecordCouponUsageOnPaymentSucceededHandler);
//# sourceMappingURL=RecordCouponUsageOnPaymentSucceededHandler.js.map