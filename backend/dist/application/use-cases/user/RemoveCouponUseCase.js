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
exports.RemoveCouponUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const RideErrors_1 = require("@domain/errors/RideErrors");
const CouponErrors_1 = require("@domain/errors/CouponErrors");
let RemoveCouponUseCase = class RemoveCouponUseCase {
    constructor(rideRepository, driverRepository, eventBus) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        const riderId = dto.getRiderId();
        const rideId = dto.rideId;
        try {
            Logger_1.Logger.info("Remove coupon requested", { riderId, rideId });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            }
            if (ride.getRiderId() !== riderId) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.unauthorizedRideAccess(rideId));
            }
            if (!ride.isAccepted() &&
                !ride.isArrived() &&
                !ride.isStarted() &&
                !ride.isCompleted()) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotEligibleForCoupon(rideId, ride.getStatus()));
            }
            if (!ride.hasCouponApplied()) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.noCouponApplied(rideId));
            }
            try {
                ride.removeCoupon();
            }
            catch (removeError) {
                return Result_1.Result.failure(new DomainError_1.DomainError(removeError instanceof Error
                    ? removeError.message
                    : String(removeError), "COUPON_REMOVE_FAILED", {
                    statusCode: 400,
                    errorType: "VALIDATION_ERROR",
                    shouldLog: false,
                    isOperational: true,
                    category: "VALIDATION",
                }));
            }
            await this.rideRepository.save(ride);
            const isRecalculation = ride.isCompleted();
            if (isRecalculation) {
                const driver = await this.driverRepository.findById(ride.getDriverId());
                const driverUserId = driver?.getUserId() ?? "";
                const fareUpdatedEvent = {
                    type: "RideFareUpdated",
                    occurredAt: new Date(),
                    payload: {
                        rideId: ride.getRideId(),
                        driverId: ride.getDriverId(),
                        driverUserId: driverUserId,
                        couponCode: "",
                        discountAmount: 0,
                        payableAmount: ride.getPayableAmount(),
                        totalFare: ride.getFare(),
                        currency: ride.getCurrency(),
                    },
                };
                await this.eventBus.publish(fareUpdatedEvent);
            }
            Logger_1.Logger.info("Coupon removed successfully", {
                riderId,
                rideId,
                payableAmount: ride.getPayableAmount(),
            });
            return Result_1.Result.success({
                rideId,
                originalFare: ride.getFare(),
                payableAmount: ride.getPayableAmount(),
                currency: ride.getCurrency(),
                message: "Coupon removed successfully",
            });
        }
        catch (error) {
            Logger_1.Logger.error("Unexpected error removing coupon", {
                riderId,
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.RemoveCouponUseCase = RemoveCouponUseCase;
exports.RemoveCouponUseCase = RemoveCouponUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RemoveCouponUseCase);
//# sourceMappingURL=RemoveCouponUseCase.js.map