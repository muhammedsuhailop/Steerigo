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
var CancelRideUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelRideUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const FareBreakdown_1 = require("@domain/value-objects/FareBreakdown");
const RideCancellationErrors_1 = require("@domain/errors/RideCancellationErrors");
let CancelRideUseCase = CancelRideUseCase_1 = class CancelRideUseCase {
    constructor(rideRepository, driverRepository, cancellationChargeService, eventBus) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.cancellationChargeService = cancellationChargeService;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        const riderId = dto.getRiderId();
        const rideId = dto.rideId;
        const reason = dto.reason;
        const now = new Date();
        try {
            Logger_1.Logger.info("Rider cancellation requested", { riderId, rideId, reason });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.rideNotFound(rideId));
            }
            if (ride.getRiderId() !== riderId) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.unauthorizedCancellation(rideId));
            }
            if (ride.isCancelled()) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.rideAlreadyCancelled(rideId));
            }
            if (ride.isCompleted()) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.cannotCancelCompletedRide(rideId));
            }
            // Eligibility — ride must not have started
            if (ride.isStarted()) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.cannotCancelStartedRide(rideId));
            }
            // Build cancellation context
            const arrivedAt = ride.getArrivedAt();
            const isDriverArrived = !!arrivedAt;
            let waitTimeMinutes = 0;
            if (arrivedAt) {
                const diffMs = now.getTime() - arrivedAt.getTime();
                waitTimeMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
            }
            const isWithinGracePeriod = isDriverArrived &&
                waitTimeMinutes <= CancelRideUseCase_1.GRACE_PERIOD_MINUTES;
            const context = {
                isBeforeMatch: ride.isRequested(),
                isWithinGracePeriod,
                isDriverArrived,
                waitTimeMinutes,
                isDriverDelayed: false,
            };
            Logger_1.Logger.debug("Cancellation context built", {
                rideId,
                ...context,
            });
            // Calculate cancellation charge
            let cancellationFee;
            try {
                cancellationFee =
                    await this.cancellationChargeService.calculateRiderCancellationCharge({
                        fareBreakdown: ride.getFareBreakdown(),
                        context,
                        searchDate: now,
                    });
            }
            catch (err) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.chargeCalculationFailed(rideId, err instanceof Error ? err.message : String(err)));
            }
            // Build resolved FareBreakdown and cancel ride
            const resolvedFareBreakdown = cancellationFee.getAmount() === 0
                ? FareBreakdown_1.FareBreakdown.zero(cancellationFee.getCurrency())
                : FareBreakdown_1.FareBreakdown.forCancellation(cancellationFee);
            try {
                ride.cancelWithFareBreakdown(resolvedFareBreakdown);
            }
            catch (err) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.fareResetFailed(rideId, err instanceof Error ? err.message : String(err)));
            }
            if (cancellationFee.getAmount() === 0) {
                ride.updatePaymentStatus(PaymentStatus_1.PaymentStatus.SUCCESS);
            }
            await this.rideRepository.save(ride);
            let driverUserId = null;
            const driverId = ride.getDriverId();
            if (driverId) {
                const driver = await this.driverRepository.findById(driverId);
                driverUserId = driver?.getUserId() ?? null;
            }
            await this.eventBus.publish({
                type: "RideCancelled",
                occurredAt: now,
                payload: {
                    rideId: ride.getRideId(),
                    riderId: ride.getRiderId(),
                    driverId,
                    driverUserId: driverUserId,
                    status: ride.getStatus(),
                    reason,
                    cancellationFeeAmount: cancellationFee.getAmount(),
                    cancellationFeeCurrency: cancellationFee.getCurrency(),
                    cancelledAt: now.toISOString(),
                    pickup: {
                        latitude: ride.getPickup().getLatitude(),
                        longitude: ride.getPickup().getLongitude(),
                        address: ride.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: ride.getDrop().getLatitude(),
                        longitude: ride.getDrop().getLongitude(),
                        address: ride.getDrop().getAddress(),
                    },
                },
            });
            Logger_1.Logger.info("Ride cancelled by rider", {
                riderId,
                rideId: ride.getRideId(),
                status: ride.getStatus(),
                paymentStatus: ride.getPaymentStatus(),
                resolvedTotalFare: ride.getFareBreakdown().getTotalFare().getAmount(),
            });
            return Result_1.Result.success({
                rideId: ride.getRideId(),
                status: ride.getStatus(),
                reason,
                cancellationFee: {
                    amount: cancellationFee.getAmount(),
                    currency: cancellationFee.getCurrency(),
                },
                feeCharged: false,
                addedToArrears: false,
                message: cancellationFee.getAmount() > 0
                    ? "Ride cancelled. A cancellation fee may be charged."
                    : "Ride cancelled successfully with no cancellation fee.",
            });
        }
        catch (error) {
            Logger_1.Logger.error("Unexpected error processing rider ride cancellation", {
                riderId,
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.CancelRideUseCase = CancelRideUseCase;
CancelRideUseCase.GRACE_PERIOD_MINUTES = 2;
exports.CancelRideUseCase = CancelRideUseCase = CancelRideUseCase_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.CancellationChargeService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CancelRideUseCase);
//# sourceMappingURL=CancelRideUseCase.js.map