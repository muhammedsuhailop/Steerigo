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
exports.SendRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const SendRideRequestResponseDto_1 = require("../../dto/user/SendRideRequestResponseDto");
const RideRequest_1 = require("../../../domain/entities/RideRequest");
const Location_1 = require("../../../domain/value-objects/Location");
const RideRequestErrors_1 = require("../../../domain/errors/RideRequestErrors");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const Result_1 = require("../../../shared/utils/Result");
let SendRideRequestUseCase = class SendRideRequestUseCase {
    constructor(rideRequestRepository, driverRepository, userRepository) {
        this.rideRequestRepository = rideRequestRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            try {
                dto.validate();
            }
            catch (validationError) {
                Logger_1.Logger.warn("SendRideRequestUseCase: DTO validation failed", {
                    error: validationError,
                    riderId: dto.riderId,
                    driverId: dto.driverId,
                });
                if (validationError instanceof DomainError_1.DomainError) {
                    return Result_1.Result.failure(validationError);
                }
                if (validationError instanceof Error) {
                    return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestCreationFailed(validationError.message));
                }
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestCreationFailed("Validation failed"));
            }
            Logger_1.Logger.info("SendRideRequestUseCase: Starting execution", {
                riderId: dto.riderId,
                driverId: dto.driverId,
                requestGroupId: dto.requestGroupId,
                totalFare: dto.fareBreakdown.getTotalFare().getAmount(),
            });
            const rider = await this.userRepository.findById(dto.riderId);
            if (!rider) {
                Logger_1.Logger.warn("SendRideRequestUseCase: Rider not found", {
                    riderId: dto.riderId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.userNotFound(dto.riderId));
            }
            const driver = await this.driverRepository.findById(dto.driverId);
            if (!driver) {
                Logger_1.Logger.warn("SendRideRequestUseCase: Driver not found", {
                    driverId: dto.driverId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.driverNotFound(dto.driverId));
            }
            if (!driver.getisAvailable()) {
                Logger_1.Logger.warn("SendRideRequestUseCase: Driver not available", {
                    driverId: dto.driverId,
                    status: driver.getStatus(),
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.driverNotAvailable(dto.driverId));
            }
            const existingRequest = await this.rideRequestRepository.findByGroupAndDriver(dto.requestGroupId, dto.driverId);
            if (existingRequest) {
                Logger_1.Logger.warn("SendRideRequestUseCase: Duplicate group-driver request detected", {
                    riderId: dto.riderId,
                    driverId: dto.driverId,
                    requestGroupId: dto.requestGroupId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.duplicateRideRequest(dto.riderId, dto.driverId));
            }
            const pendingRequests = await this.rideRequestRepository.findPendingByRiderId(dto.riderId);
            const hasPendingRequestToDriver = pendingRequests.some((req) => req.getDriverId() === dto.driverId);
            if (hasPendingRequestToDriver) {
                Logger_1.Logger.warn("SendRideRequestUseCase: Duplicate pending request detected", {
                    riderId: dto.riderId,
                    driverId: dto.driverId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.duplicateRideRequest(dto.riderId, dto.driverId));
            }
            const pickup = Location_1.Location.create({
                latitude: dto.pickupLatitude,
                longitude: dto.pickupLongitude,
                address: dto.pickupAddress,
            });
            const drop = Location_1.Location.create({
                latitude: dto.dropLatitude,
                longitude: dto.dropLongitude,
                address: dto.dropAddress,
            });
            const rideRequest = RideRequest_1.RideRequest.create(dto.driverId, driver.getUserId(), dto.riderId, dto.requestGroupId, pickup, drop, dto.pickupTime, dto.timeRequired, dto.rideType, dto.fareBreakdown, dto.pickupETA);
            const savedRequest = await this.rideRequestRepository.save(rideRequest);
            if (!savedRequest) {
                Logger_1.Logger.error("SendRideRequestUseCase: Failed to save ride request", {
                    requestGroupId: dto.requestGroupId,
                    riderId: dto.riderId,
                    driverId: dto.driverId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestCreationFailed("Failed to persist request"));
            }
            Logger_1.Logger.info("SendRideRequestUseCase: Ride request created successfully", {
                requestId: savedRequest.getId(),
                riderId: dto.riderId,
                driverId: dto.driverId,
                requestGroupId: dto.requestGroupId,
                status: savedRequest.getStatus(),
                totalFare: savedRequest.getFare(),
            });
            const responseDto = SendRideRequestResponseDto_1.SendRideRequestResponseDto.fromDomain(savedRequest);
            return Result_1.Result.success(responseDto);
        }
        catch (error) {
            Logger_1.Logger.error("SendRideRequestUseCase: Execution failed", {
                error,
                riderId: dto.riderId,
                driverId: dto.driverId,
            });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            if (error instanceof Error) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestCreationFailed(error.message));
            }
            return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestCreationFailed("Unknown error occurred"));
        }
    }
};
exports.SendRideRequestUseCase = SendRideRequestUseCase;
exports.SendRideRequestUseCase = SendRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SendRideRequestUseCase);
//# sourceMappingURL=SendRideRequestUseCase.js.map