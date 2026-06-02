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
exports.AcceptFutureRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const FutureRideErrors_1 = require("../../../domain/errors/FutureRideErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const DomainError_1 = require("../../../domain/errors/DomainError");
const FutureRideRequestStatus_1 = require("../../../domain/value-objects/FutureRideRequestStatus");
const RedisLockKeys_1 = require("../../../shared/constants/RedisLockKeys");
const FutureRideMessages_1 = require("../../../shared/constants/FutureRideMessages");
const CreateRideChatRoomDto_1 = require("../../dto/chat/CreateRideChatRoomDto");
const RideTimeline_1 = require("../../../domain/value-objects/RideTimeline");
const BookingType_1 = require("../../../domain/value-objects/BookingType");
const Ride_1 = require("../../../domain/entities/Ride");
let AcceptFutureRideRequestUseCase = class AcceptFutureRideRequestUseCase {
    constructor(driverRepository, futureRideRequestRepository, futureRideExpiryService, lockService, eventBus, rideRepository, uuIdGenerator, createRideChatRoomUseCase, idGenerator, otpService) {
        this.driverRepository = driverRepository;
        this.futureRideRequestRepository = futureRideRequestRepository;
        this.futureRideExpiryService = futureRideExpiryService;
        this.lockService = lockService;
        this.eventBus = eventBus;
        this.rideRepository = rideRepository;
        this.uuIdGenerator = uuIdGenerator;
        this.createRideChatRoomUseCase = createRideChatRoomUseCase;
        this.idGenerator = idGenerator;
        this.otpService = otpService;
        this.LOCK_TTL_SECONDS = Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
        this.LOCK_KEY_PREFIX = RedisLockKeys_1.REDIS_LOCK_KEYS.FUTURE_RIDE_ACCEPT;
    }
    async execute(dto) {
        const requestId = dto.getRequestId();
        const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
        let lockToken = null;
        try {
            dto.validate();
            Logger_1.Logger.info("Accepting future ride request", {
                userId: dto.getUserId(),
                requestId,
            });
            lockToken = await this.lockService.acquireLock(lockKey, this.LOCK_TTL_SECONDS);
            if (!lockToken) {
                Logger_1.Logger.warn("Failed to acquire lock for future ride — already being processed", { requestId });
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed("Request is already being processed"));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const futureRequest = await this.futureRideRequestRepository.findById(requestId);
            if (!futureRequest) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.requestGroupNotFound(requestId));
            }
            if (futureRequest.getDriverId() !== driverId) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.unauthorizedCancellation(requestId));
            }
            if (futureRequest.getStatus() !== FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.cannotCancelRequest(requestId, futureRequest.getStatus()));
            }
            const requestGroupId = futureRequest.getRequestGroupId();
            const alreadyAccepted = await this.futureRideRequestRepository.existsAcceptedInGroup(requestGroupId);
            if (alreadyAccepted) {
                Logger_1.Logger.warn("Future ride group already accepted by another driver", {
                    requestId,
                    requestGroupId,
                    driverId,
                });
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed("This ride has already been accepted by another driver"));
            }
            const groupRequests = await this.futureRideRequestRepository.findByRequestGroupId(requestGroupId);
            const otherDriverRequests = groupRequests.filter((request) => request.getId() !== futureRequest.getId() &&
                (request.getStatus() === FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING ||
                    request.getStatus() === FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED));
            const pickupTime = futureRequest.getPickupTime();
            const requiredDurationHours = futureRequest.getrequiredHours();
            const hasConflict = await this.rideRepository.hasTimeSlotConflict(driverId, pickupTime, requiredDurationHours);
            if (hasConflict) {
                Logger_1.Logger.warn("Driver has a time slot conflict for scheduled ride", {
                    driverId,
                    requestId,
                    pickupTime,
                    requiredDurationHours,
                });
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.timeSlotConflict());
            }
            futureRequest.markAccepted();
            await this.futureRideRequestRepository.save(futureRequest);
            const cancelledCount = await this.futureRideRequestRepository.cancelAllPendingInGroup(requestGroupId);
            Logger_1.Logger.info("Future ride request accepted — other requests cancelled", {
                requestId,
                requestGroupId,
                driverId,
                cancelledCount,
            });
            await this.futureRideExpiryService.cancelGroupExpiry(requestGroupId);
            await Promise.all(otherDriverRequests.map((request) => this.eventBus.publish({
                type: "FutureRideRequestCancelledForDriver",
                occurredAt: new Date(),
                payload: {
                    futureRequestId: request.getId(),
                    requestGroupId,
                    driverId: request.getDriverId(),
                    driverUserId: request.getDriverUserId(),
                    acceptedByDriverId: driverId,
                    cancelledByRider: false,
                },
            })));
            const rideId = `RIDE-${this.uuIdGenerator.generate()}`;
            const timeline = new RideTimeline_1.RideTimeline(futureRequest.getCreatedAt());
            const verificationCode = Number(this.otpService.generate());
            timeline.setAcceptedAt(new Date());
            const ride = Ride_1.Ride.create(this.idGenerator.generate(), rideId, driverId, futureRequest.getRiderId(), futureRequest.getPickup(), futureRequest.getDrop(), futureRequest.getPickupTime(), futureRequest.getrequiredHours(), futureRequest.getRideType(), BookingType_1.BookingType.SCHEDULED, futureRequest.getFareBreakdown(), timeline, verificationCode);
            ride.setStatusToAccepted();
            const savedRide = await this.rideRepository.save(ride);
            Logger_1.Logger.info("Scheduled ride created successfully from request", {
                rideId: savedRide.getRideId(),
                futureRequestId: futureRequest.getId(),
                requestGroupId,
                driverId,
                riderId: futureRequest.getRiderId(),
            });
            await this.createRideChatRoomUseCase.execute(new CreateRideChatRoomDto_1.CreateRideChatRoomDto(dto.getUserId(), {
                rideId: savedRide.getRideId(),
            }));
            const event = {
                type: "FutureRideAccepted",
                occurredAt: new Date(),
                payload: {
                    futureRequestId: futureRequest.getId(),
                    requestGroupId,
                    rideId: rideId,
                    driverId,
                    riderId: futureRequest.getRiderId(),
                    status: futureRequest.getStatus(),
                    pickup: {
                        latitude: futureRequest.getPickup().getLatitude(),
                        longitude: futureRequest.getPickup().getLongitude(),
                        address: futureRequest.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: futureRequest.getDrop().getLatitude(),
                        longitude: futureRequest.getDrop().getLongitude(),
                        address: futureRequest.getDrop().getAddress(),
                    },
                    pickupTime: futureRequest.getPickupTime().toISOString(),
                    rideType: futureRequest.getRideType(),
                    fare: {
                        amount: futureRequest.getFareBreakdown().getTotalFare().getAmount(),
                        currency: futureRequest
                            .getFareBreakdown()
                            .getTotalFare()
                            .getCurrency(),
                    },
                },
            };
            await this.eventBus.publish(event);
            const response = {
                success: true,
                message: FutureRideMessages_1.FUTURE_RIDE_SUCCESS_MESSAGES.SCHEDULED,
                data: {
                    futureRequestId: futureRequest.getId(),
                    requestGroupId,
                    rideId,
                    riderId: futureRequest.getRiderId(),
                    driverId,
                    pickup: {
                        latitude: futureRequest.getPickup().getLatitude(),
                        longitude: futureRequest.getPickup().getLongitude(),
                        address: futureRequest.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: futureRequest.getDrop().getLatitude(),
                        longitude: futureRequest.getDrop().getLongitude(),
                        address: futureRequest.getDrop().getAddress(),
                    },
                    pickupTime: futureRequest.getPickupTime().toISOString(),
                    rideType: futureRequest.getRideType(),
                    fare: futureRequest.getFareBreakdown().getTotalFare().getAmount(),
                    currency: futureRequest
                        .getFareBreakdown()
                        .getTotalFare()
                        .getCurrency(),
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error accepting future ride request", {
                userId: dto.getUserId(),
                requestId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed(error instanceof Error ? error.message : "Unknown error"));
        }
        finally {
            if (lockToken) {
                await this.lockService.releaseLock(lockKey, lockToken);
            }
        }
    }
};
exports.AcceptFutureRideRequestUseCase = AcceptFutureRideRequestUseCase;
exports.AcceptFutureRideRequestUseCase = AcceptFutureRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideRequestRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideExpiryService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DistributedLockService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.UuidGenerator)),
    __param(7, (0, inversify_1.inject)(DITypes_1.TYPES.CreateRideChatRoomUseCase)),
    __param(8, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __param(9, (0, inversify_1.inject)(DITypes_1.TYPES.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AcceptFutureRideRequestUseCase);
//# sourceMappingURL=AcceptFutureRideRequestUseCase.js.map