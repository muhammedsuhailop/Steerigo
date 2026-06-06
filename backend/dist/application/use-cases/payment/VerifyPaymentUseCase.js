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
exports.VerifyPaymentUseCase = void 0;
const inversify_1 = require("inversify");
const PaymentStatus_1 = require("../../../domain/value-objects/PaymentStatus");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const PaymentErrors_1 = require("../../../domain/errors/PaymentErrors");
const PaymentMessages_1 = require("../../../shared/constants/PaymentMessages");
const PaymentFailureReason_1 = require("../../../domain/value-objects/PaymentFailureReason");
const Money_1 = require("../../../domain/value-objects/Money");
let VerifyPaymentUseCase = class VerifyPaymentUseCase {
    constructor(paymentRepository, rideRepository, paymentGatewayService, earningsDistributionService, eventBus, driverRepository) {
        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
        this.paymentGatewayService = paymentGatewayService;
        this.earningsDistributionService = earningsDistributionService;
        this.eventBus = eventBus;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        const paymentId = dto.getPaymentId();
        try {
            Logger_1.Logger.info("Verifying payment", { paymentId, userId: dto.getUserId() });
            const payment = await this.paymentRepository.findById(paymentId);
            if (!payment) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.paymentNotFound(paymentId));
            }
            if (payment.getRiderId() !== dto.getUserId()) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.unauthorizedPaymentAccess(paymentId));
            }
            const ride = await this.rideRepository.findByRideId(payment.getRideId());
            const now = new Date();
            const isValid = this.paymentGatewayService.verifySignature({
                gatewayOrderId: dto.getGatewayOrderId(),
                gatewayPaymentId: dto.getGatewayPaymentId(),
                gatewaySignature: dto.getGatewaySignature(),
            });
            let driverUserId = null;
            if (ride) {
                const driver = await this.driverRepository.findById(ride.getDriverId());
                driverUserId = driver?.getUserId() ?? null;
            }
            if (!isValid) {
                payment.markFailed(PaymentFailureReason_1.PaymentFailureReason.SIGNATURE_VERIFICATION_FAILED);
                await this.paymentRepository.save(payment);
                await this.eventBus.publish({
                    type: "PaymentFailed",
                    occurredAt: now,
                    payload: {
                        paymentId,
                        rideId: payment.getRideId(),
                        driverUserId: driverUserId,
                        riderId: payment.getRiderId(),
                        reason: PaymentFailureReason_1.PaymentFailureReason.SIGNATURE_VERIFICATION_FAILED,
                        failedAt: now.toISOString(),
                    },
                });
                if (ride) {
                    ride.getTimeline().setPaymentFailedAt(now);
                    await this.rideRepository.save(ride);
                }
                Logger_1.Logger.warn("Payment signature invalid", { paymentId });
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.invalidSignature());
            }
            payment.attachGatewayIds({
                gatewayPaymentId: dto.getGatewayPaymentId(),
                gatewaySignature: dto.getGatewaySignature(),
            });
            payment.markSuccess(dto.getGatewayPaymentId(), now);
            const savedPayment = await this.paymentRepository.save(payment);
            if (ride) {
                ride.getTimeline().setPaymentCompletedAt(now);
                ride.updatePaymentStatus(PaymentStatus_1.PaymentStatus.SUCCESS);
                await this.rideRepository.save(ride);
                const driver = await this.driverRepository.findById(ride.getDriverId());
                driverUserId = driver?.getUserId() ?? null;
                const fareBreakdown = ride.getFareBreakdown();
                const payableAmount = ride.getPayableAmount();
                const discountAmount = ride.getDiscountAmount();
                const groupId = `settlement_${ride.getRideId()}_${Date.now()}`;
                await this.earningsDistributionService
                    .distribute({
                    rideId: ride.getRideId(),
                    driverId: ride.getDriverId(),
                    totalFare: ride.getFareBreakdown().getTotalFare(),
                    platformFee: fareBreakdown.getPlatformFee(),
                    platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
                    payableAmount: Money_1.Money.create(payableAmount, ride.getCurrency()),
                    discount: Money_1.Money.create(discountAmount, ride.getCurrency()),
                    groupId,
                })
                    .catch((err) => {
                    Logger_1.Logger.error("Earnings distribution failed after online payment", {
                        paymentId,
                        rideId: ride.getRideId(),
                        error: err.message,
                    });
                });
            }
            Logger_1.Logger.info("Payment verified and marked successful", {
                paymentId,
                rideId: payment.getRideId(),
                paidAt: now.toISOString(),
            });
            await this.eventBus.publish({
                type: "PaymentSucceeded",
                occurredAt: now,
                payload: {
                    paymentId,
                    rideId: payment.getRideId(),
                    driverId: ride?.getDriverId(),
                    driverUserId: driverUserId,
                    riderId: payment.getRiderId(),
                    amount: payment.getAmount().getAmount(),
                    currency: payment.getAmount().getCurrency(),
                    paidAt: now.toISOString(),
                },
            });
            return Result_1.Result.success({
                success: true,
                message: PaymentMessages_1.PAYMENT_MESSAGES.VERIFIED,
                data: {
                    paymentId: savedPayment.getId(),
                    rideId: savedPayment.getRideId(),
                    status: savedPayment.getStatus(),
                    paidAt: now.toISOString(),
                    amount: savedPayment.getAmount().getAmount(),
                    currency: savedPayment.getAmount().getCurrency(),
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error verifying payment", {
                paymentId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.VerifyPaymentUseCase = VerifyPaymentUseCase;
exports.VerifyPaymentUseCase = VerifyPaymentUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentGatewayService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.EarningsDistributionService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], VerifyPaymentUseCase);
//# sourceMappingURL=VerifyPaymentUseCase.js.map