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
exports.AcceptRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const RideRequestErrors_1 = require("../../../domain/errors/RideRequestErrors");
const RideErrors_1 = require("../../../domain/errors/RideErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const Ride_1 = require("../../../domain/entities/Ride");
const RideTimeline_1 = require("../../../domain/value-objects/RideTimeline");
const AvailabilityStatus_1 = require("../../../domain/value-objects/AvailabilityStatus");
const RideMessages_1 = require("../../../shared/constants/RideMessages");
const RedisLockKeys_1 = require("../../../shared/constants/RedisLockKeys");
const RideRequestGroupStatus_1 = require("../../../domain/value-objects/RideRequestGroupStatus");
const CreateRideChatRoomDto_1 = require("../../dto/chat/CreateRideChatRoomDto");
const BookingType_1 = require("../../../domain/value-objects/BookingType");
let AcceptRideRequestUseCase = class AcceptRideRequestUseCase {
    constructor(driverRepository, rideRequestRepository, rideRepository, driverAvailabilityRepository, rideRequestGroupRepository, rideSearchDispatchService, lockService, eventBus, createRideChatRoomUseCase, uuIdGenerator, idGenerator, otpService) {
        this.driverRepository = driverRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.rideRepository = rideRepository;
        this.driverAvailabilityRepository = driverAvailabilityRepository;
        this.rideRequestGroupRepository = rideRequestGroupRepository;
        this.rideSearchDispatchService = rideSearchDispatchService;
        this.lockService = lockService;
        this.eventBus = eventBus;
        this.createRideChatRoomUseCase = createRideChatRoomUseCase;
        this.uuIdGenerator = uuIdGenerator;
        this.idGenerator = idGenerator;
        this.otpService = otpService;
        this.LOCK_TTL_SECONDS = Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
        this.LOCK_KEY_PREFIX = RedisLockKeys_1.REDIS_LOCK_KEYS.RIDE_ACCEPT;
    }
    async execute(dto) {
        const requestId = dto.getRequestId();
        const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
        let lockToken = null;
        try {
            Logger_1.Logger.info("Accepting ride request", {
                userId: dto.getUserId(),
                requestId,
            });
            lockToken = await this.lockService.acquireLock(lockKey, this.LOCK_TTL_SECONDS);
            if (!lockToken) {
                Logger_1.Logger.warn("Failed to acquire lock - already being processed", {
                    requestId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.requestAlreadyBeingProcessed(requestId));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const rideRequest = await this.rideRequestRepository.findById(requestId);
            if (!rideRequest) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestNotFound(requestId));
            }
            if (rideRequest.getDriverId().toString() !== driverId) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestNotForDriver(requestId, driverId));
            }
            if (!rideRequest.isPending()) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestNotPending(requestId, rideRequest.getStatus()));
            }
            const now = new Date();
            const createdAt = rideRequest.getCreatedAt();
            const ageMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
            if (ageMinutes > 1.5) {
                Logger_1.Logger.warn("Ride request expired by age check", {
                    requestId,
                    ageMinutes,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestExpired(requestId));
            }
            const existingActiveRide = await this.rideRepository.findActiveRideByDriverId(driverId);
            if (existingActiveRide) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.driverAlreadyHasActiveRide(driverId, existingActiveRide.getRideId()));
            }
            const hasScheduledConflict = await this.rideRepository.hasTimeSlotConflict(driverId, rideRequest.getPickupTime(), rideRequest.getTimeRequired());
            if (hasScheduledConflict) {
                Logger_1.Logger.warn("Driver has scheduled ride conflict", {
                    driverId,
                    requestId,
                    pickupTime: rideRequest.getPickupTime(),
                    timeRequiredHours: rideRequest.getTimeRequired(),
                });
                return Result_1.Result.failure(RideErrors_1.RideErrors.timeSlotConflict());
            }
            const acceptedRequest = await this.rideRequestRepository.atomicAcceptRideRequest(requestId);
            if (!acceptedRequest) {
                Logger_1.Logger.warn("Atomic accept failed - probably already accepted", {
                    requestId,
                });
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.requestAlreadyAccepted(requestId));
            }
            const groupId = acceptedRequest.getRequestGroupId();
            const group = await this.rideRequestGroupRepository.findActiveById(groupId);
            if (group) {
                await this.rideRequestGroupRepository.updateStatus(groupId, RideRequestGroupStatus_1.RideRequestGroupStatus.COMPLETED);
                await this.rideSearchDispatchService.cancelGroupJobs(groupId);
            }
            const cancelledCount = await this.rideRequestRepository.cancelOtherPendingRequestsInGroup(groupId, acceptedRequest.getId());
            Logger_1.Logger.info("Ride request accepted", {
                requestId,
                driverId,
                requestGroupId: groupId,
                cancelledCount,
            });
            const rideId = `RIDE-${this.uuIdGenerator.generate()}`;
            const timeline = new RideTimeline_1.RideTimeline(new Date());
            timeline.setAcceptedAt(new Date());
            const verificationCode = Number(this.otpService.generate());
            const ride = Ride_1.Ride.create(this.idGenerator.generate(), rideId, driverId, acceptedRequest.getRiderId(), acceptedRequest.getPickup(), acceptedRequest.getDrop(), acceptedRequest.getPickupTime(), acceptedRequest.getTimeRequired(), acceptedRequest.getRideType(), BookingType_1.BookingType.INSTANT, acceptedRequest.getFareBreakdown(), timeline, verificationCode);
            ride.setStatusToAccepted();
            const savedRide = await this.rideRepository.save(ride);
            Logger_1.Logger.info("Ride created successfully", {
                rideId: savedRide.getRideId(),
                requestId: acceptedRequest.getId(),
                driverId,
                riderId: acceptedRequest.getRiderId(),
            });
            await this.markDriverAsBusy(driverId);
            await this.createRideChatRoomUseCase.execute(new CreateRideChatRoomDto_1.CreateRideChatRoomDto(dto.getUserId(), {
                rideId: savedRide.getRideId(),
            }));
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_REQUEST_ACCEPTED,
                data: {
                    rideId: savedRide.getRideId(),
                    requestId: acceptedRequest.getId(),
                    riderId: acceptedRequest.getRiderId(),
                    driverId,
                    status: savedRide.getStatus(),
                    pickup: {
                        latitude: acceptedRequest.getPickup().getLatitude(),
                        longitude: acceptedRequest.getPickup().getLongitude(),
                        address: acceptedRequest.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: acceptedRequest.getDrop().getLatitude(),
                        longitude: acceptedRequest.getDrop().getLongitude(),
                        address: acceptedRequest.getDrop().getAddress(),
                    },
                    rideType: acceptedRequest.getRideType(),
                    fare: acceptedRequest.getFare(),
                    currency: savedRide.getCurrency(),
                    pickupTime: acceptedRequest.getPickupTime().toISOString(),
                    timeline: {
                        requestedAt: savedRide.getTimeline().getRequestedAt().toISOString(),
                        acceptedAt: savedRide.getTimeline().getAcceptedAt().toISOString(),
                    },
                },
            };
            const rideMatchedEvent = {
                type: "RideMatched",
                occurredAt: new Date(),
                payload: {
                    rideId: savedRide.getRideId(),
                    driverId,
                    riderId: acceptedRequest.getRiderId(),
                    pickup: {
                        latitude: acceptedRequest.getPickup().getLatitude(),
                        longitude: acceptedRequest.getPickup().getLongitude(),
                        address: acceptedRequest.getPickup().getAddress(),
                    },
                    drop: {
                        latitude: acceptedRequest.getDrop().getLatitude(),
                        longitude: acceptedRequest.getDrop().getLongitude(),
                        address: acceptedRequest.getDrop().getAddress(),
                    },
                    pickupTime: acceptedRequest.getPickupTime().toISOString(),
                    rideType: acceptedRequest.getRideType(),
                    status: savedRide.getStatus(),
                    currency: savedRide.getCurrency(),
                    fare: {
                        amount: acceptedRequest.getFare(),
                        currency: savedRide.getCurrency(),
                    },
                },
            };
            await this.eventBus.publish(rideMatchedEvent);
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error accepting ride request", {
                userId: dto.getUserId(),
                requestId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
        finally {
            if (lockToken) {
                await this.lockService.releaseLock(lockKey, lockToken);
            }
        }
    }
    async markDriverAsBusy(driverId) {
        try {
            const availability = await this.driverAvailabilityRepository.findActiveByDriverId(driverId);
            if (!availability) {
                Logger_1.Logger.warn("No active availability record found when marking driver busy", { driverId });
                return;
            }
            if (availability.getStatus() === AvailabilityStatus_1.AvailabilityStatus.BUSY) {
                Logger_1.Logger.debug("Driver availability already BUSY", { driverId });
                return;
            }
            availability.updateStatus(AvailabilityStatus_1.AvailabilityStatus.BUSY);
            await this.driverAvailabilityRepository.save(availability);
            Logger_1.Logger.info("Driver availability marked as BUSY", { driverId });
        }
        catch (error) {
            Logger_1.Logger.error("Failed to mark driver availability as BUSY — non-critical", {
                driverId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
};
exports.AcceptRideRequestUseCase = AcceptRideRequestUseCase;
exports.AcceptRideRequestUseCase = AcceptRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestGroupRepository)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.RideSearchDispatchService)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.DistributedLockService)),
    __param(7, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(8, (0, inversify_1.inject)(DITypes_1.TYPES.CreateRideChatRoomUseCase)),
    __param(9, (0, inversify_1.inject)(DITypes_1.TYPES.UuidGenerator)),
    __param(10, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __param(11, (0, inversify_1.inject)(DITypes_1.TYPES.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AcceptRideRequestUseCase);
//# sourceMappingURL=AcceptRideRequestUseCase.js.map