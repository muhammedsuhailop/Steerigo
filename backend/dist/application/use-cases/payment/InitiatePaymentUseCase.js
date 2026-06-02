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
exports.InitiatePaymentUseCase = void 0;
const inversify_1 = require("inversify");
const Payment_1 = require("@domain/entities/Payment");
const Money_1 = require("@domain/value-objects/Money");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const PaymentErrors_1 = require("@domain/errors/PaymentErrors");
const RideErrors_1 = require("@domain/errors/RideErrors");
let InitiatePaymentUseCase = class InitiatePaymentUseCase {
    constructor(rideRepository, paymentRepository, eventBus, idGenerator, strategies) {
        this.rideRepository = rideRepository;
        this.paymentRepository = paymentRepository;
        this.eventBus = eventBus;
        this.idGenerator = idGenerator;
        this.strategyMap = new Map(strategies.map((strategy) => [strategy.getMethod(), strategy]));
    }
    async execute(dto) {
        const rideId = dto.getRideId();
        const method = dto.getMethod();
        const userId = dto.getUserId();
        try {
            Logger_1.Logger.info("Initiating payment", { userId, rideId, method });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride)
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            if (!ride.isCompleted()) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.rideNotCompleted(rideId));
            }
            if (ride.getRiderId() !== userId) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.unauthorizedPaymentAccess(rideId));
            }
            const existingPayment = await this.paymentRepository.findSuccessfulByRideId(rideId);
            if (existingPayment) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.paymentAlreadyExists(rideId));
            }
            const now = new Date();
            ride.getTimeline().setPaymentInitiatedAt(now);
            const amount = Money_1.Money.create(ride.getPayableAmount(), ride.getCurrency());
            const paymentId = this.idGenerator.generate("PAY");
            const payment = Payment_1.Payment.create(paymentId, rideId, ride.getRiderId(), ride.getDriverId(), amount, method, { initiatedBy: userId });
            await this.eventBus.publish({
                type: "PaymentInitiated",
                occurredAt: new Date(),
                payload: {
                    paymentId: payment.getId(),
                    rideId,
                    riderId: ride.getRiderId(),
                    amount: amount.getAmount(),
                    currency: amount.getCurrency(),
                    method: payment.getMethod(),
                },
            });
            const strategy = this.strategyMap.get(method);
            if (!strategy) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.invalidPaymentMethod(method));
            }
            const result = await strategy.execute({
                payment,
                ride,
                amount,
                userId,
            });
            if (result.isFailure()) {
                return Result_1.Result.failure(result.getError());
            }
            return Result_1.Result.success({
                success: true,
                method,
                message: strategy.getSuccessMessage(),
                data: result.getValue(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error initiating payment", {
                userId,
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.InitiatePaymentUseCase = InitiatePaymentUseCase;
exports.InitiatePaymentUseCase = InitiatePaymentUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.NanoIdGenerator)),
    __param(4, (0, inversify_1.multiInject)(DITypes_1.TYPES.PaymentStrategies)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Array])
], InitiatePaymentUseCase);
//# sourceMappingURL=InitiatePaymentUseCase.js.map