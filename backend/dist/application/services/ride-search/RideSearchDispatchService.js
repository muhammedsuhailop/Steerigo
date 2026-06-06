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
exports.RideSearchDispatchService = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const RideRequest_1 = require("../../../domain/entities/RideRequest");
const RideRequestGroupStatus_1 = require("../../../domain/value-objects/RideRequestGroupStatus");
const RideRequestStatus_1 = require("../../../domain/value-objects/RideRequestStatus");
const RedisLockKeys_1 = require("../../../shared/constants/RedisLockKeys");
const Logger_1 = require("../../../shared/utils/Logger");
let RideSearchDispatchService = class RideSearchDispatchService {
    constructor(rideRequestGroupRepository, rideRequestRepository, driverRepository, userRepository, eventBus, lockService, rideSearchQueue) {
        this.rideRequestGroupRepository = rideRequestGroupRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.eventBus = eventBus;
        this.lockService = lockService;
        this.rideSearchQueue = rideSearchQueue;
        this.DISPATCH_LOCK_TTL_SECONDS = 10;
    }
    async scheduleGroupGuards(requestGroupId) {
        await this.rideSearchQueue.scheduleNoDriverNotification({ requestGroupId });
        await this.rideSearchQueue.scheduleHardExpire({ requestGroupId });
    }
    async cancelGroupJobs(requestGroupId) {
        await this.rideSearchQueue.cancelGroupJobs(requestGroupId);
    }
    async dispatchNextRequest(requestGroupId, currentIndexOverride) {
        Logger_1.Logger.info("Dispatch next ride request started", {
            requestGroupId,
            currentIndexOverride,
        });
        const lockKey = `${RedisLockKeys_1.REDIS_LOCK_KEYS.RIDE_REQUEST_GROUP_DISPATCH}${requestGroupId}`;
        const lockToken = await this.lockService.acquireLock(lockKey, this.DISPATCH_LOCK_TTL_SECONDS);
        if (!lockToken) {
            Logger_1.Logger.warn("Dispatch lock acquisition failed", { requestGroupId });
            return;
        }
        Logger_1.Logger.debug("Dispatch lock acquired", {
            requestGroupId,
            currentIndexOverride,
            lockKey,
        });
        try {
            const group = await this.rideRequestGroupRepository.findActiveById(requestGroupId);
            if (!group) {
                Logger_1.Logger.warn("Ride request group not active for dispatch", {
                    requestGroupId,
                });
                return;
            }
            Logger_1.Logger.info("Ride request group loaded for dispatch", {
                requestGroupId,
                riderId: group.getRiderId(),
                currentIndex: group.getCurrentIndex(),
                totalCandidates: group.getCandidateDriverIds().length,
                status: group.getStatus?.(),
            });
            const candidateDriverIds = group.getCandidateDriverIds();
            const index = typeof currentIndexOverride === "number"
                ? currentIndexOverride
                : group.getCurrentIndex();
            Logger_1.Logger.debug("Resolved dispatch index", {
                requestGroupId,
                currentIndexOverride,
                resolvedIndex: index,
                groupCurrentIndex: group.getCurrentIndex(),
            });
            if (index >= candidateDriverIds.length) {
                Logger_1.Logger.warn("No more candidate drivers available", {
                    requestGroupId: group.getId(),
                    riderId: group.getRiderId(),
                    currentIndex: index,
                    totalCandidates: candidateDriverIds.length,
                });
                await this.expireGroupAndNotify(group.getId(), group.getRiderId(), "No more drivers available");
                return;
            }
            if (index !== group.getCurrentIndex()) {
                Logger_1.Logger.debug("Updating ride request group current index", {
                    requestGroupId: group.getId(),
                    previousIndex: group.getCurrentIndex(),
                    nextIndex: index,
                });
                await this.rideRequestGroupRepository.updateCurrentIndex(group.getId(), index);
            }
            const driverId = candidateDriverIds[index];
            const driver = await this.driverRepository.findById(driverId);
            if (!driver) {
                Logger_1.Logger.warn("Driver not found during dispatch, moving next", {
                    requestGroupId,
                    driverId,
                    index,
                });
                await this.dispatchNextRequest(group.getId(), index + 1);
                return;
            }
            Logger_1.Logger.debug("Checking existing request for group and driver", {
                requestGroupId: group.getId(),
                driverId,
                index,
            });
            const existingRequest = await this.rideRequestRepository.findByGroupAndDriver(group.getId(), driverId);
            let request = existingRequest;
            if (!request) {
                Logger_1.Logger.info("Creating ride request for driver", {
                    requestGroupId: group.getId(),
                    driverId,
                    riderId: group.getRiderId(),
                    index,
                });
                const pickup = group.getPickup();
                const drop = group.getDrop();
                request = RideRequest_1.RideRequest.create(driverId, driver.getUserId(), group.getRiderId(), group.getId(), pickup, drop, new Date(), group.getTimeRequired(), group.getRideType(), group.getFareBreakdown(), "5 mins");
                request = await this.rideRequestRepository.save(request);
                Logger_1.Logger.info("Ride request saved", {
                    requestGroupId: group.getId(),
                    requestId: request.getId(),
                    driverId,
                    index,
                });
            }
            else if (request.getStatus() !== RideRequestStatus_1.RideRequestStatus.PENDING) {
                Logger_1.Logger.warn("Existing request is not pending, moving to next driver", {
                    requestGroupId: group.getId(),
                    requestId: request.getId(),
                    driverId,
                    status: request.getStatus(),
                    index,
                });
                await this.dispatchNextRequest(group.getId(), index + 1);
                return;
            }
            const driverUser = await this.userRepository.findById(driver.getUserId());
            const driverSocketUserId = driver.getUserId();
            const pickup = group.getPickup();
            const drop = group.getDrop();
            const createdEvent = {
                type: "RideRequestCreated",
                occurredAt: new Date(),
                payload: {
                    requestId: request.getId(),
                    requestGroupId: group.getId(),
                    riderId: group.getRiderId(),
                    driverId: driverSocketUserId,
                    pickup: {
                        latitude: pickup.getLatitude(),
                        longitude: pickup.getLongitude(),
                        address: pickup.getAddress(),
                    },
                    drop: {
                        latitude: drop.getLatitude(),
                        longitude: drop.getLongitude(),
                        address: drop.getAddress(),
                    },
                    pickupTime: request.getPickupTime().toISOString(),
                    rideType: request.getRideType(),
                    pickupETA: request.getPickupETA(),
                    fareBreakdown: request.getFareBreakdown(),
                    searchedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 30000).toISOString(),
                },
            };
            Logger_1.Logger.info("Publishing RideRequestCreated event", {
                requestGroupId: group.getId(),
                requestId: request.getId(),
                driverId,
            });
            await this.eventBus.publish(createdEvent);
            Logger_1.Logger.debug("RideRequestCreated event published", {
                requestGroupId: group.getId(),
                requestId: request.getId(),
                driverId,
            });
            Logger_1.Logger.info("Scheduling request timeout job", {
                requestGroupId: group.getId(),
                requestId: request.getId(),
                driverId,
                currentIndex: index,
                delayMs: 30000,
            });
            await this.rideSearchQueue.scheduleRequestTimeout({
                requestGroupId: group.getId(),
                requestId: request.getId(),
                driverId,
                currentIndex: index,
            });
            Logger_1.Logger.debug("Request timeout job scheduled", {
                requestGroupId: group.getId(),
                requestId: request.getId(),
                driverId,
            });
            const progressEvent = {
                type: "RideSearchProgressUpdated",
                occurredAt: new Date(),
                payload: {
                    requestGroupId: group.getId(),
                    riderId: group.getRiderId(),
                    currentIndex: index,
                    totalCandidates: candidateDriverIds.length,
                    message: index === 0
                        ? "Searching for a nearby driver"
                        : "Finding another nearby driver",
                    status: "SEARCHING",
                },
            };
            Logger_1.Logger.info("Publishing ride search progress", {
                requestGroupId: group.getId(),
                riderId: group.getRiderId(),
                currentIndex: index,
                totalCandidates: candidateDriverIds.length,
                status: "SEARCHING",
            });
            await this.eventBus.publish(progressEvent);
            Logger_1.Logger.debug("Ride search progress published", {
                requestGroupId: group.getId(),
                riderId: group.getRiderId(),
                currentIndex: index,
            });
            Logger_1.Logger.info("Ride request dispatched to driver", {
                requestGroupId: group.getId(),
                requestId: request.getId(),
                driverId,
                driverName: driverUser?.getName?.(),
                currentIndex: index,
                totalCandidates: candidateDriverIds.length,
            });
        }
        finally {
            await this.lockService.releaseLock(lockKey, lockToken);
        }
    }
    async publishSearchProgress(payload) {
        const progressEvent = {
            type: "RideSearchProgressUpdated",
            occurredAt: new Date(),
            payload,
        };
        await this.eventBus.publish(progressEvent);
    }
    async expireGroupAndNotify(requestGroupId, riderId, reason) {
        Logger_1.Logger.warn("Expiring ride request group", {
            requestGroupId,
            riderId,
            reason,
        });
        await this.rideRequestGroupRepository.updateStatus(requestGroupId, RideRequestGroupStatus_1.RideRequestGroupStatus.EXPIRED);
        await this.rideSearchQueue.cancelGroupJobs(requestGroupId);
        Logger_1.Logger.info("Publishing ride request group exhausted event", {
            requestGroupId,
            riderId,
            reason,
        });
        const exhaustedEvent = {
            type: "RideRequestGroupExhausted",
            occurredAt: new Date(),
            payload: {
                requestGroupId,
                riderId,
                reason,
            },
        };
        await this.eventBus.publish(exhaustedEvent);
        await this.publishSearchProgress({
            requestGroupId,
            riderId,
            currentIndex: 0,
            totalCandidates: 0,
            message: "No drivers found nearby",
            status: "EXPIRED",
        });
    }
};
exports.RideSearchDispatchService = RideSearchDispatchService;
exports.RideSearchDispatchService = RideSearchDispatchService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestGroupRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.DistributedLockService)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.RideSearchQueue)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], RideSearchDispatchService);
//# sourceMappingURL=RideSearchDispatchService.js.map