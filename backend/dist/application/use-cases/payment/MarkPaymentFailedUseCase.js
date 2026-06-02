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
exports.MarkPaymentFailedUseCase = void 0;
const inversify_1 = require("inversify");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const PaymentErrors_1 = require("@domain/errors/PaymentErrors");
const PaymentMessages_1 = require("@shared/constants/PaymentMessages");
let MarkPaymentFailedUseCase = class MarkPaymentFailedUseCase {
    constructor(paymentRepository, rideRepository, eventBus, driverRepository) {
        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
        this.eventBus = eventBus;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        const paymentId = dto.getPaymentId();
        let driverUserId = null;
        try {
            Logger_1.Logger.info("Marking payment as failed", {
                paymentId,
                userId: dto.getUserId(),
                reason: dto.getReason(),
            });
            const payment = await this.paymentRepository.findById(paymentId);
            if (!payment) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.paymentNotFound(paymentId));
            }
            if (payment.getRiderId() !== dto.getUserId()) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.unauthorizedPaymentAccess(paymentId));
            }
            if (payment.getStatus() !== PaymentStatus_1.PaymentStatus.PENDING) {
                return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.paymentNotPending(paymentId));
            }
            const failedAt = new Date();
            payment.markFailed(dto.getReason());
            const savedPayment = await this.paymentRepository.save(payment);
            const ride = await this.rideRepository.findByRideId(payment.getRideId());
            if (ride) {
                ride.getTimeline().setPaymentFailedAt(failedAt);
                ride.updatePaymentStatus(PaymentStatus_1.PaymentStatus.FAILED);
                await this.rideRepository.save(ride);
                const driver = await this.driverRepository.findById(ride.getDriverId());
                driverUserId = driver?.getUserId() ?? null;
            }
            Logger_1.Logger.info("Payment marked as failed", {
                paymentId,
                rideId: payment.getRideId(),
                reason: dto.getReason(),
                failedAt: failedAt.toISOString(),
            });
            await this.eventBus.publish({
                type: "PaymentFailed",
                occurredAt: failedAt,
                payload: {
                    paymentId,
                    rideId: payment.getRideId(),
                    driverUserId: driverUserId,
                    riderId: payment.getRiderId(),
                    reason: dto.getReason(),
                    failedAt: failedAt.toISOString(),
                },
            });
            return Result_1.Result.success({
                success: true,
                message: PaymentMessages_1.PAYMENT_MESSAGES.PAYMENT_FAILED,
                data: {
                    paymentId: savedPayment.getId(),
                    rideId: savedPayment.getRideId(),
                    status: savedPayment.getStatus(),
                    method: savedPayment.getMethod(),
                    failureReason: dto.getReason(),
                    amount: savedPayment.getAmount().getAmount(),
                    currency: savedPayment.getAmount().getCurrency(),
                    failedAt: failedAt.toISOString(),
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error marking payment as failed", {
                paymentId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.MarkPaymentFailedUseCase = MarkPaymentFailedUseCase;
exports.MarkPaymentFailedUseCase = MarkPaymentFailedUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], MarkPaymentFailedUseCase);
//# sourceMappingURL=MarkPaymentFailedUseCase.js.map