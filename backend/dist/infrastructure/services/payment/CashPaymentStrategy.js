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
exports.CashPaymentStrategy = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
const PaymentMethod_1 = require("@domain/value-objects/PaymentMethod");
const PaymentMessages_1 = require("@shared/constants/PaymentMessages");
const Logger_1 = require("@shared/utils/Logger");
let CashPaymentStrategy = class CashPaymentStrategy {
    constructor(paymentRepository, rideRepository) {
        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
    }
    getMethod() {
        return PaymentMethod_1.PaymentMethod.CASH;
    }
    getSuccessMessage() {
        return PaymentMessages_1.PAYMENT_MESSAGES.CASH_PAYMENT_INITIATED;
    }
    async execute({ payment, ride, }) {
        await this.paymentRepository.save(payment);
        await this.rideRepository.save(ride);
        Logger_1.Logger.info("Cash payment initiated", {
            paymentId: payment.getId(),
            rideId: ride.getRideId(),
        });
        return Result_1.Result.success({
            paymentId: payment.getId(),
            status: payment.getStatus(),
            amount: payment.getAmount().getAmount(),
            currency: payment.getAmount().getCurrency(),
        });
    }
};
exports.CashPaymentStrategy = CashPaymentStrategy;
exports.CashPaymentStrategy = CashPaymentStrategy = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CashPaymentStrategy);
//# sourceMappingURL=CashPaymentStrategy.js.map