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
exports.MarkRideAsStartedUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const RideErrors_1 = require("@domain/errors/RideErrors");
const DriverNotFoundError_1 = require("@domain/errors/DriverNotFoundError");
const RideMessages_1 = require("@shared/constants/RideMessages");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
let MarkRideAsStartedUseCase = class MarkRideAsStartedUseCase {
    constructor(driverRepository, rideRepository, eventBus) {
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        const rideId = dto.getRideId();
        try {
            Logger_1.Logger.info("Marking ride as started", {
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
            if (!ride.isAccepted() && !ride.isArrived()) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.invalidRideStatusTransition(ride.getStatus(), RideStatus_1.RideStatus.STARTED, rideId));
            }
            const wasArrivedAutoSet = ride.isAccepted() && !ride.getArrivedAt();
            if (ride.getVerificationCode() !== Number(dto.getVerificationCode())) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.invalidVerificationCode(rideId));
            }
            ride.setStatusToStarted();
            const updatedRide = await this.rideRepository.save(ride);
            Logger_1.Logger.info("Ride marked as started successfully", {
                rideId: updatedRide.getRideId(),
                driverId,
                wasArrivedAutoSet,
                arrivedAt: updatedRide.getArrivedAt()?.toISOString(),
                startedAt: updatedRide.getStartedAt()?.toISOString(),
            });
            const rideStartedEvent = {
                type: "RideStarted",
                occurredAt: new Date(),
                payload: {
                    rideId: updatedRide.getRideId(),
                    riderId: updatedRide.getRiderId(),
                    driverId: updatedRide.getDriverId(),
                    status: updatedRide.getStatus(),
                    arrivedAt: updatedRide.getArrivedAt().toISOString(),
                    startedAt: updatedRide.getStartedAt().toISOString(),
                    wasArrivedAutoSet,
                    pickup: {
                        latitude: updatedRide.getPickup().getLatitude(),
                        longitude: updatedRide.getPickup().getLongitude(),
                        address: updatedRide.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: updatedRide.getDrop().getLatitude(),
                        longitude: updatedRide.getDrop().getLongitude(),
                        address: updatedRide.getDrop().getAddress(),
                    },
                },
            };
            await this.eventBus.publish(rideStartedEvent);
            const response = {
                success: true,
                message: wasArrivedAutoSet
                    ? RideMessages_1.RIDE_MESSAGES.RIDE_STARTED_WITH_AUTO_ARRIVED
                    : RideMessages_1.RIDE_MESSAGES.RIDE_STARTED,
                data: {
                    rideId: updatedRide.getRideId(),
                    status: updatedRide.getStatus(),
                    arrivedAt: updatedRide.getArrivedAt().toISOString(),
                    startedAt: updatedRide.getStartedAt().toISOString(),
                    wasArrivedAutoSet,
                    pickup: {
                        latitude: updatedRide.getPickup().getLatitude(),
                        longitude: updatedRide.getPickup().getLongitude(),
                        address: updatedRide.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: updatedRide.getDrop().getLatitude(),
                        longitude: updatedRide.getDrop().getLongitude(),
                        address: updatedRide.getDrop().getAddress(),
                    },
                    riderId: updatedRide.getRiderId(),
                    driverId: updatedRide.getDriverId(),
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error marking ride as started", {
                userId: dto.getUserId(),
                rideId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.MarkRideAsStartedUseCase = MarkRideAsStartedUseCase;
exports.MarkRideAsStartedUseCase = MarkRideAsStartedUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MarkRideAsStartedUseCase);
//# sourceMappingURL=MarkRideAsStartedUseCase.js.map