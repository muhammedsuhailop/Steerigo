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
exports.MarkRideAsCompletedUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const RideErrors_1 = require("../../../domain/errors/RideErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const RideStatus_1 = require("../../../domain/value-objects/RideStatus");
let MarkRideAsCompletedUseCase = class MarkRideAsCompletedUseCase {
    constructor(driverRepository, rideRepository, fareCalculationService, eventBus, couponValidationService) {
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.fareCalculationService = fareCalculationService;
        this.eventBus = eventBus;
        this.couponValidationService = couponValidationService;
    }
    async execute(dto) {
        const rideId = dto.getRideId();
        try {
            Logger_1.Logger.info("Marking ride as completed", {
                userId: dto.getUserId(),
                rideId,
            });
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            }
            if (ride.getDriverId() !== driverId) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.unauthorizedRideAccess(rideId));
            }
            if (!ride.isStarted()) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.invalidRideStatusTransition(ride.getStatus(), RideStatus_1.RideStatus.COMPLETED, rideId));
            }
            const startedAt = ride.getStartedAt();
            if (!startedAt) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.invalidRideStatusTransition(ride.getStatus(), RideStatus_1.RideStatus.COMPLETED, rideId));
            }
            const completedAt = new Date();
            const bookedDurationMinutes = ride.getTimeRequired() * 60;
            const actualDurationMinutes = Math.ceil((completedAt.getTime() - startedAt.getTime()) / (1000 * 60));
            const finalDurationMinutes = Math.max(bookedDurationMinutes, actualDurationMinutes);
            Logger_1.Logger.debug("Calculating final fare based on actual duration", {
                rideId,
                startedAt: startedAt.toISOString(),
                completedAt: completedAt.toISOString(),
                actualDurationMinutes,
            });
            const finalFareBreakdown = await this.fareCalculationService.calculateFare({
                durationMinutes: finalDurationMinutes,
                searchDate: completedAt,
            });
            ride.completeWithFareBreakdown(finalFareBreakdown);
            if (ride.hasCouponApplied()) {
                const couponDetails = ride.getCouponDetails();
                try {
                    const validationResult = await this.couponValidationService.validateAndCalculate(couponDetails.code, ride.getFare(), ride.getRiderId(), new Date());
                    const { coupon, discountAmount } = validationResult;
                    ride.applyCoupon(coupon.getId(), coupon.getCode(), discountAmount, coupon.getDiscountType(), true);
                    Logger_1.Logger.info("Coupon recalculated after ride completion", {
                        rideId,
                        couponCode: coupon.getCode(),
                        newDiscount: discountAmount,
                        payableAmount: ride.getPayableAmount(),
                    });
                }
                catch (error) {
                    ride.removeCoupon();
                    Logger_1.Logger.warn("Coupon removed after ride completion (invalid)", {
                        rideId,
                        couponCode: couponDetails?.code,
                        reason: error instanceof Error ? error.message : String(error),
                    });
                }
            }
            const updatedRide = await this.rideRepository.save(ride);
            Logger_1.Logger.info("Ride completed successfully", {
                rideId: updatedRide.getRideId(),
                driverId,
                actualDurationMinutes,
                durationHours: finalFareBreakdown.getDurationHours(),
                totalFare: updatedRide.getFare(),
                newTotalRides: driver.getTotalRides(),
            });
            // await this.markDriverAsScheduled(driverId);
            const fareBreakdown = updatedRide.getFareBreakdown();
            const fareBreakdownJson = {
                baseFare: fareBreakdown.getBaseFare().toJSON(),
                platformFee: fareBreakdown.getPlatformFee().toJSON(),
                taxes: {
                    fare: {
                        name: fareBreakdown.getFareTax().name,
                        amount: fareBreakdown.getFareTax().amount.toJSON(),
                    },
                    platformFee: {
                        name: fareBreakdown.getPlatformFeeTax().name,
                        amount: fareBreakdown.getPlatformFeeTax().amount.toJSON(),
                    },
                },
                totalFare: fareBreakdown.getTotalFare().toJSON(),
                durationHours: fareBreakdown.getDurationHours(),
                actualDurationMinutes,
            };
            const rideCompletedEvent = {
                type: "RideCompleted",
                occurredAt: new Date(),
                payload: {
                    rideId: updatedRide.getRideId(),
                    riderId: updatedRide.getRiderId(),
                    driverId: updatedRide.getDriverId(),
                    status: updatedRide.getStatus(),
                    arrivedAt: updatedRide.getArrivedAt()?.toISOString(),
                    startedAt: updatedRide.getStartedAt().toISOString(),
                    completedAt: updatedRide.getCompletedAt().toISOString(),
                    fareBreakdown: fareBreakdownJson,
                    payableAmount: updatedRide.getPayableAmount(),
                },
            };
            await this.eventBus.publish(rideCompletedEvent);
            const response = {
                rideId: updatedRide.getRideId(),
                status: updatedRide.getStatus(),
                arrivedAt: updatedRide.getArrivedAt()?.toISOString(),
                startedAt: updatedRide.getStartedAt().toISOString(),
                completedAt: updatedRide.getCompletedAt().toISOString(),
                fareBreakdown: fareBreakdownJson,
                riderId: updatedRide.getRiderId(),
                driverId: updatedRide.getDriverId(),
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error marking ride as completed", {
                userId: dto.getUserId(),
                rideId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.MarkRideAsCompletedUseCase = MarkRideAsCompletedUseCase;
exports.MarkRideAsCompletedUseCase = MarkRideAsCompletedUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.FareCalculationService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.CouponValidationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], MarkRideAsCompletedUseCase);
//# sourceMappingURL=MarkRideAsCompletedUseCase.js.map