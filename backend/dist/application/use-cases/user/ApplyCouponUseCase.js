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
exports.ApplyCouponUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const RideErrors_1 = require("@domain/errors/RideErrors");
const CouponErrors_1 = require("@domain/errors/CouponErrors");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
let ApplyCouponUseCase = class ApplyCouponUseCase {
    constructor(rideRepository, couponValidationService, eventBus, driverRepository) {
        this.rideRepository = rideRepository;
        this.couponValidationService = couponValidationService;
        this.eventBus = eventBus;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        const riderId = dto.getRiderId();
        const rideId = dto.rideId;
        const couponCode = dto.couponCode;
        try {
            Logger_1.Logger.info("Apply coupon requested", { riderId, rideId, couponCode });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            }
            if (ride.getRiderId() !== riderId) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.unauthorizedRideAccess(rideId));
            }
            const isRecalculation = ride.isCompleted();
            const isEligibleForCoupon = ride.isAccepted() ||
                ride.isArrived() ||
                ride.isStarted() ||
                ride.isCompleted();
            if (!isEligibleForCoupon) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotEligibleForCoupon(rideId, ride.getStatus()));
            }
            if (ride.getPaymentStatus() !== PaymentStatus_1.PaymentStatus.PENDING) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.cannotApplyCouponAfterPayment(rideId));
            }
            if (ride.hasCouponApplied() && !isRecalculation) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.couponAlreadyAppliedToRide(rideId));
            }
            const now = new Date();
            const rideAmount = ride.getFare();
            let validationResult;
            try {
                validationResult =
                    await this.couponValidationService.validateAndCalculate(couponCode, rideAmount, riderId, now);
            }
            catch (validationError) {
                return Result_1.Result.failure(validationError);
            }
            const { coupon, discountAmount } = validationResult;
            try {
                ride.applyCoupon(coupon.getId(), coupon.getCode(), discountAmount, coupon.getDiscountType(), isRecalculation);
            }
            catch (applyError) {
                return Result_1.Result.failure(new DomainError_1.DomainError(applyError instanceof Error
                    ? applyError.message
                    : String(applyError), "COUPON_APPLY_FAILED", {
                    statusCode: 400,
                    errorType: "VALIDATION_ERROR",
                    shouldLog: false,
                    isOperational: true,
                    category: "VALIDATION",
                }));
            }
            await this.rideRepository.save(ride);
            const driver = await this.driverRepository.findById(ride.getDriverId());
            const driverUserId = driver?.getUserId() ?? "";
            if (isRecalculation) {
                const fareUpdatedEvent = {
                    type: "RideFareUpdated",
                    occurredAt: new Date(),
                    payload: {
                        rideId: ride.getRideId(),
                        driverUserId: driverUserId,
                        driverId: ride.getDriverId(),
                        couponCode: coupon.getCode(),
                        discountAmount: discountAmount,
                        payableAmount: ride.getPayableAmount(),
                        totalFare: ride.getFare(),
                        currency: ride.getCurrency(),
                        couponType: coupon.getDiscountType(),
                    },
                };
                await this.eventBus.publish(fareUpdatedEvent);
            }
            Logger_1.Logger.info("Coupon applied successfully", {
                riderId,
                rideId,
                couponCode,
                discountAmount,
                payableAmount: ride.getPayableAmount(),
            });
            return Result_1.Result.success({
                rideId,
                couponCode: coupon.getCode(),
                discountType: coupon.getDiscountType(),
                originalFare: ride.getFare(),
                discountAmount,
                payableAmount: ride.getPayableAmount(),
                currency: ride.getCurrency(),
                message: "Coupon applied successfully",
            });
        }
        catch (error) {
            Logger_1.Logger.error("Unexpected error applying coupon", {
                riderId,
                rideId,
                couponCode,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.ApplyCouponUseCase = ApplyCouponUseCase;
exports.ApplyCouponUseCase = ApplyCouponUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.CouponValidationService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ApplyCouponUseCase);
//# sourceMappingURL=ApplyCouponUseCase.js.map