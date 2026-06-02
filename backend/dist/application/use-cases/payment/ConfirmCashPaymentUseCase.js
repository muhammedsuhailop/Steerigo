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
exports.ConfirmCashPaymentUseCase = void 0;
const inversify_1 = require("inversify");
const PaymentStatus_1 = require("../../../domain/value-objects/PaymentStatus");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const PaymentErrors_1 = require("../../../domain/errors/PaymentErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const Money_1 = require("../../../domain/value-objects/Money");
const Payment_1 = require("../../../domain/entities/Payment");
const PaymentMethod_1 = require("../../../domain/value-objects/PaymentMethod");
const PaymentMessages_1 = require("../../../shared/constants/PaymentMessages");
let ConfirmCashPaymentUseCase = class ConfirmCashPaymentUseCase {
    constructor(paymentRepository, rideRepository, driverRepository, earningsDistributionService, idGenerator, eventBus) {
        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.earningsDistributionService = earningsDistributionService;
        this.idGenerator = idGenerator;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        const rideId = dto.getRideId();
        try {
            Logger_1.Logger.info("Confirming cash payment by driver", {
                rideId,
                userId: dto.getUserId(),
            });
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            let driverUserId = null;
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.paymentNotFound(rideId));
            }
            if (ride.getDriverId() !== driverId) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.cashConfirmationUnauthorized(rideId));
            }
            if (!ride.isCompleted()) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.rideNotCompleted(rideId));
            }
            driverUserId = driver?.getUserId() ?? null;
            const existingPayment = await this.paymentRepository.findSuccessfulByRideId(rideId);
            if (existingPayment) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.paymentAlreadyExists(rideId));
            }
            const payableAmount = ride.getPayableAmount();
            const totalFare = ride.getFare();
            const discountAmount = ride.getDiscountAmount();
            const providedAmount = dto.getAmount();
            if (Math.abs(payableAmount - providedAmount) > 1) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.invalidPaymentAmount(payableAmount.toString(), providedAmount.toString()));
            }
            const amount = Money_1.Money.create(payableAmount, ride.getCurrency());
            const paymentId = this.idGenerator.generate("PAY");
            const paidAt = new Date();
            if (!ride.getTimeline().getPaymentInitiatedAt()) {
                ride.getTimeline().setPaymentInitiatedAt(paidAt);
            }
            ride.getTimeline().setPaymentCompletedAt(paidAt);
            const payment = Payment_1.Payment.create(paymentId, rideId, ride.getRiderId(), ride.getDriverId(), amount, PaymentMethod_1.PaymentMethod.CASH, { confirmedBy: driverId });
            payment.confirmCashCollected(paidAt);
            const savedPayment = await this.paymentRepository.save(payment);
            ride.updatePaymentStatus(PaymentStatus_1.PaymentStatus.SUCCESS);
            await this.rideRepository.save(ride);
            const fareBreakdown = ride.getFareBreakdown();
            await this.earningsDistributionService
                .distributeCashPayment({
                rideId: ride.getRideId(),
                driverId: ride.getDriverId(),
                totalFare: fareBreakdown.getTotalFare(),
                platformFee: fareBreakdown.getPlatformFee(),
                platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
                payableAmount: Money_1.Money.create(payableAmount, ride.getCurrency()),
                discount: Money_1.Money.create(discountAmount, ride.getCurrency()),
            })
                .catch((err) => {
                Logger_1.Logger.error("Earnings distribution failed after cash payment", {
                    rideId,
                    error: err.message,
                });
            });
            Logger_1.Logger.info("Cash payment confirmed and payment created", {
                paymentId: savedPayment.getId(),
                rideId,
                driverId,
                paidAt: paidAt.toISOString(),
                payableAmount,
                totalFare,
                discountAmount,
            });
            await this.eventBus.publish({
                type: "PaymentCashConfirmed",
                occurredAt: paidAt,
                payload: {
                    paymentId: savedPayment.getId(),
                    rideId,
                    driverId,
                    riderId: ride.getRiderId(),
                    driverUserId: driverUserId,
                    amount: payableAmount,
                    currency: ride.getCurrency(),
                    paidAt: paidAt.toISOString(),
                },
            });
            return Result_1.Result.success({
                success: true,
                message: PaymentMessages_1.PAYMENT_MESSAGES.CONFIRMED,
                data: {
                    paymentId: savedPayment.getId(),
                    rideId: savedPayment.getRideId(),
                    status: savedPayment.getStatus(),
                    paidAt: paidAt.toISOString(),
                    amount: payableAmount,
                    currency: ride.getCurrency(),
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error confirming cash payment", {
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.ConfirmCashPaymentUseCase = ConfirmCashPaymentUseCase;
exports.ConfirmCashPaymentUseCase = ConfirmCashPaymentUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.EarningsDistributionService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.NanoIdGenerator)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ConfirmCashPaymentUseCase);
//# sourceMappingURL=ConfirmCashPaymentUseCase.js.map