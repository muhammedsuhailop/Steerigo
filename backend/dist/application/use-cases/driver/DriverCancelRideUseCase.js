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
exports.DriverCancelRideUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const FareBreakdown_1 = require("@domain/value-objects/FareBreakdown");
const RideCancellationErrors_1 = require("@domain/errors/RideCancellationErrors");
let DriverCancelRideUseCase = class DriverCancelRideUseCase {
    constructor(driverRepository, rideRepository, earningsDistributionService, cancellationChargeService, eventBus) {
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.earningsDistributionService = earningsDistributionService;
        this.cancellationChargeService = cancellationChargeService;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        const userId = dto.getUserId();
        const rideId = dto.getRideId();
        const reason = dto.reason;
        const now = new Date();
        try {
            Logger_1.Logger.info("Driver cancellation requested", { userId, rideId, reason });
            const driver = await this.driverRepository.findByUserId(userId);
            if (!driver) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.driverNotFound(userId));
            }
            const driverId = driver.getId().toString();
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.rideNotFound(rideId));
            }
            if (ride.getDriverId() !== driverId) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.unauthorizedCancellation(rideId));
            }
            if (ride.isCancelled()) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.rideAlreadyCancelled(rideId));
            }
            if (ride.isCompleted()) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.cannotCancelCompletedRide(rideId));
            }
            const arrivedAt = ride.getArrivedAt();
            const isDriverArrived = !!arrivedAt;
            let waitTimeMinutes = 0;
            if (arrivedAt) {
                const diffMs = now.getTime() - arrivedAt.getTime();
                waitTimeMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
            }
            const context = {
                isDriverArrived,
                isTripStarted: ride.isStarted(),
                waitTimeMinutes,
            };
            Logger_1.Logger.debug("Driver cancellation context built", { rideId, ...context });
            let outcome;
            try {
                outcome =
                    await this.cancellationChargeService.calculateDriverCancellationOutcome({
                        fareBreakdown: ride.getFareBreakdown(),
                        context,
                        searchDate: now,
                    });
            }
            catch (err) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.chargeCalculationFailed(rideId, err instanceof Error ? err.message : String(err)));
            }
            const { riderCharge, driverPenalty } = outcome;
            const resolvedFareBreakdown = riderCharge.getAmount() === 0
                ? FareBreakdown_1.FareBreakdown.zero(riderCharge.getCurrency())
                : FareBreakdown_1.FareBreakdown.forCancellation(riderCharge);
            try {
                ride.cancelByDriver(resolvedFareBreakdown);
            }
            catch (err) {
                return Result_1.Result.failure(RideCancellationErrors_1.RideCancellationErrors.fareResetFailed(rideId, err instanceof Error ? err.message : String(err)));
            }
            if (riderCharge.getAmount() === 0) {
                ride.updatePaymentStatus(PaymentStatus_1.PaymentStatus.SUCCESS);
            }
            await this.rideRepository.save(ride);
            let penaltyDeducted = false;
            if (riderCharge.getAmount() > 0 || driverPenalty.getAmount() > 0) {
                try {
                    await this.earningsDistributionService.distributeCancellation({
                        rideId: ride.getRideId(),
                        driverId,
                        riderId: ride.getRiderId(),
                        riderCharge,
                        driverPenalty,
                    });
                    if (driverPenalty.getAmount() > 0) {
                        penaltyDeducted = true;
                    }
                }
                catch (err) {
                    Logger_1.Logger.error("Failed to distribute cancellation charges/penalties", {
                        driverId,
                        rideId,
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            }
            await this.eventBus.publish({
                type: "RideCancelledByDriver",
                occurredAt: now,
                payload: {
                    rideId: ride.getRideId(),
                    riderId: ride.getRiderId(),
                    driverId,
                    driverUserId: userId,
                    status: ride.getStatus(),
                    reason,
                    riderChargeAmount: riderCharge.getAmount(),
                    riderChargeCurrency: riderCharge.getCurrency(),
                    driverPenaltyAmount: driverPenalty.getAmount(),
                    driverPenaltyCurrency: driverPenalty.getCurrency(),
                    penaltyDeducted,
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
            Logger_1.Logger.info("Ride cancelled by driver", {
                userId,
                driverId,
                rideId: ride.getRideId(),
                status: ride.getStatus(),
                paymentStatus: ride.getPaymentStatus(),
                resolvedRiderFare: ride.getFareBreakdown().getTotalFare().getAmount(),
                driverPenalty: driverPenalty.getAmount(),
                penaltyDeducted,
            });
            const message = driverPenalty.getAmount() > 0
                ? penaltyDeducted
                    ? "Ride cancelled. A cancellation penalty has been deducted from your wallet."
                    : "Ride cancelled. A cancellation penalty could not be deducted and will be applied later."
                : "Ride cancelled with no penalty applied.";
            return Result_1.Result.success({
                rideId: ride.getRideId(),
                status: ride.getStatus(),
                reason,
                riderCharge: {
                    amount: riderCharge.getAmount(),
                    currency: riderCharge.getCurrency(),
                },
                driverPenalty: {
                    amount: driverPenalty.getAmount(),
                    currency: driverPenalty.getCurrency(),
                },
                penaltyDeducted,
                message,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Unexpected error during driver ride cancellation", {
                userId,
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.DriverCancelRideUseCase = DriverCancelRideUseCase;
exports.DriverCancelRideUseCase = DriverCancelRideUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EarningsDistributionService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.CancellationChargeService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DriverCancelRideUseCase);
//# sourceMappingURL=DriverCancelRideUseCase.js.map