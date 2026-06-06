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
exports.ScheduleFutureRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const ScheduleFutureRideResponseDto_1 = require("../../dto/user/ScheduleFutureRideResponseDto");
const FutureRideRequest_1 = require("../../../domain/entities/FutureRideRequest");
const Location_1 = require("../../../domain/value-objects/Location");
const FutureRideErrors_1 = require("../../../domain/errors/FutureRideErrors");
const AppConstants_1 = require("../../../shared/constants/AppConstants");
const FutureRideRequestStatus_1 = require("../../../domain/value-objects/FutureRideRequestStatus");
let ScheduleFutureRideRequestUseCase = class ScheduleFutureRideRequestUseCase {
    constructor(futureRideRequestRepository, driverAvailabilityRepository, fareCalculationService, futureRideExpiryService, eventBus) {
        this.futureRideRequestRepository = futureRideRequestRepository;
        this.driverAvailabilityRepository = driverAvailabilityRepository;
        this.fareCalculationService = fareCalculationService;
        this.futureRideExpiryService = futureRideExpiryService;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        try {
            dto.validate();
            const availableFrom = dto.getAvailabilityCheckTime();
            const nearbyAvailabilities = await this.driverAvailabilityRepository.findNearbyAvailableDriversByBaseLocation(dto.latitude, dto.longitude, availableFrom, dto.radiusKm, dto.maxCandidates);
            if (nearbyAvailabilities.length === 0) {
                Logger_1.Logger.info("No nearby drivers found for future ride request", {
                    requestGroupId: dto.requestGroupId,
                    riderId: dto.getRiderId(),
                    pickupTime: dto.pickupTime,
                });
                return Result_1.Result.success(ScheduleFutureRideResponseDto_1.ScheduleFutureRideResponseDto.create(dto.requestGroupId, [], dto.pickupTime, dto.requiredDuration));
            }
            const fareBreakdown = await this.fareCalculationService.calculateFare({
                durationMinutes: dto.requiredDuration,
                searchDate: dto.pickupTime,
            });
            const pickup = Location_1.Location.create({
                latitude: dto.latitude,
                longitude: dto.longitude,
                address: dto.pickupAddress,
            });
            const drop = Location_1.Location.create({
                latitude: dto.dropLatitude,
                longitude: dto.dropLongitude,
                address: dto.dropAddress,
            });
            const saveResults = await Promise.allSettled(nearbyAvailabilities.map(async (availability) => {
                const driverId = availability.driver.getDriverId();
                const driverUserId = availability.driverUserId;
                const request = FutureRideRequest_1.FutureRideRequest.create({
                    riderId: dto.getRiderId(),
                    requestGroupId: dto.requestGroupId,
                    pickup,
                    drop,
                    pickupTime: dto.pickupTime,
                    requiredDuration: dto.requiredDuration,
                    rideType: dto.rideType,
                    fareBreakdown,
                    pickupETA: AppConstants_1.AppConstants.FUTURE_RIDE_DEFAULT_ETA_LABEL,
                });
                request.assignDriver(driverId, driverUserId);
                const saved = await this.futureRideRequestRepository.save(request);
                return {
                    requestId: saved.getId(),
                    driverId,
                    driverUserId,
                    pickupETA: AppConstants_1.AppConstants.FUTURE_RIDE_DEFAULT_ETA_LABEL,
                    totalFare: fareBreakdown.getTotalFare().getAmount(),
                    currency: fareBreakdown.getTotalFare().getCurrency(),
                };
            }));
            saveResults.forEach((result, index) => {
                if (result.status === "rejected") {
                    Logger_1.Logger.error("Future ride request save failed", {
                        index,
                        requestGroupId: dto.requestGroupId,
                        error: result.reason instanceof Error
                            ? {
                                name: result.reason.name,
                                message: result.reason.message,
                                stack: result.reason.stack,
                            }
                            : result.reason,
                    });
                }
            });
            const successfulRequests = saveResults
                .filter((r) => r.status === "fulfilled")
                .map((r) => r.value);
            const failedCount = saveResults.filter((r) => r.status === "rejected").length;
            if (failedCount > 0) {
                Logger_1.Logger.warn("Some future ride requests failed to save", {
                    requestGroupId: dto.requestGroupId,
                    failedCount,
                });
            }
            if (successfulRequests.length === 0) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed("All driver request saves failed"));
            }
            const expiresAt = new Date(Date.now() + AppConstants_1.AppConstants.FUTURE_RIDE_EXPIRY_WINDOW_MS).toISOString();
            const notifyResults = await Promise.allSettled(successfulRequests.map((req) => this.eventBus.publish({
                type: "FutureRideRequestSentToDriver",
                occurredAt: new Date(),
                payload: {
                    requestId: req.requestId,
                    requestGroupId: dto.requestGroupId,
                    driverId: req.driverId,
                    driverUserId: req.driverUserId,
                    riderId: dto.getRiderId(),
                    pickup: {
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                        address: dto.pickupAddress,
                    },
                    drop: {
                        latitude: dto.dropLatitude,
                        longitude: dto.dropLongitude,
                        address: dto.dropAddress,
                    },
                    pickupTime: dto.pickupTime.toISOString(),
                    pickupETA: dto.pickupTime.toISOString(),
                    rideType: dto.rideType,
                    fare: fareBreakdown.getTotalFare().getAmount(),
                    currency: fareBreakdown.getTotalFare().getCurrency(),
                    status: FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED,
                    requiredDuration: dto.requiredDuration,
                    createdAt: new Date().toISOString(),
                    expiresAt,
                },
            })));
            notifyResults.forEach((result, index) => {
                if (result.status === "rejected") {
                    Logger_1.Logger.warn("Failed to notify driver of future ride request", {
                        index,
                        requestGroupId: dto.requestGroupId,
                        driverId: successfulRequests[index]?.driverId,
                        error: result.reason instanceof Error
                            ? result.reason.message
                            : result.reason,
                    });
                }
            });
            await this.futureRideExpiryService.scheduleGroupExpiry(dto.requestGroupId);
            Logger_1.Logger.info("Future ride scheduled successfully", {
                requestGroupId: dto.requestGroupId,
                riderId: dto.getRiderId(),
                driverCount: successfulRequests.length,
                pickupTime: dto.pickupTime,
                availableFrom,
            });
            return Result_1.Result.success(ScheduleFutureRideResponseDto_1.ScheduleFutureRideResponseDto.create(dto.requestGroupId, successfulRequests, dto.pickupTime, AppConstants_1.AppConstants.FUTURE_RIDE_EXPIRY_WINDOW_MS));
        }
        catch (error) {
            Logger_1.Logger.error("Schedule future ride failed", {
                error,
                requestGroupId: dto.requestGroupId,
                riderId: dto.getRiderId(),
            });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed(error instanceof Error ? error.message : "Unknown error"));
        }
    }
};
exports.ScheduleFutureRideRequestUseCase = ScheduleFutureRideRequestUseCase;
exports.ScheduleFutureRideRequestUseCase = ScheduleFutureRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideRequestRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.FareCalculationService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideExpiryService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ScheduleFutureRideRequestUseCase);
//# sourceMappingURL=ScheduleFutureRideRequestUseCase.js.map