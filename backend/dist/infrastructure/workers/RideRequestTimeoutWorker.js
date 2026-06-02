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
exports.RideRequestTimeoutWorker = void 0;
const bullmq_1 = require("bullmq");
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const BullMQConnection_1 = require("@infrastructure/queues/BullMQConnection");
const RideSearchQueueConstants_1 = require("@shared/constants/RideSearchQueueConstants");
const Logger_1 = require("@shared/utils/Logger");
const RideRequestGroupStatus_1 = require("@domain/value-objects/RideRequestGroupStatus");
const RedisLockKeys_1 = require("@shared/constants/RedisLockKeys");
const RedisPubSubClient_1 = require("@infrastructure/realtime/RedisPubSubClient");
const PubSubChannels_1 = require("@infrastructure/realtime/constants/PubSubChannels");
let RideRequestTimeoutWorker = class RideRequestTimeoutWorker {
    constructor(rideRequestRepository, rideRequestGroupRepository, rideSearchDispatchService, eventBus, lockService) {
        this.rideRequestRepository = rideRequestRepository;
        this.rideRequestGroupRepository = rideRequestGroupRepository;
        this.rideSearchDispatchService = rideSearchDispatchService;
        this.eventBus = eventBus;
        this.lockService = lockService;
    }
    start() {
        this.worker = new bullmq_1.Worker(RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.NAME, async (job) => this.process(job), {
            connection: (0, BullMQConnection_1.getBullMQConnection)(),
            concurrency: 10,
        });
        this.worker.on("completed", (job) => {
            Logger_1.Logger.info("Ride search worker job completed", {
                jobId: job.id,
                name: job.name,
            });
        });
        this.worker.on("failed", (job, error) => {
            Logger_1.Logger.error("Ride search worker job failed", {
                jobId: job?.id,
                name: job?.name,
                error: error.message,
            });
        });
    }
    async close() {
        await this.worker?.close();
    }
    async process(job) {
        switch (job.name) {
            case RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.JOBS.REQUEST_TIMEOUT:
                await this.handleRequestTimeout(job);
                return;
            case RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.JOBS.GROUP_NOTIFY_NO_DRIVER:
                await this.handleGroupNotifyNoDriver(job);
                return;
            case RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.JOBS.GROUP_HARD_EXPIRE:
                await this.handleGroupHardExpire(job);
                return;
            default:
                Logger_1.Logger.warn("Unknown ride search job received", {
                    jobId: job.id,
                    name: job.name,
                });
        }
    }
    async handleRequestTimeout(job) {
        const { requestId, requestGroupId, currentIndex } = job.data;
        const lockKey = `${RedisLockKeys_1.REDIS_LOCK_KEYS.RIDE_REQUEST_GROUP_TIMEOUT}${requestGroupId}`;
        const lockToken = await this.lockService.acquireLock(lockKey, 10);
        if (!lockToken) {
            Logger_1.Logger.warn("Skipping timeout handling due to lock contention", {
                requestGroupId,
                requestId,
            });
            return;
        }
        try {
            const group = await this.rideRequestGroupRepository.findActiveById(requestGroupId);
            if (!group) {
                Logger_1.Logger.info("Group no longer active during request timeout", {
                    requestGroupId,
                    requestId,
                });
                return;
            }
            const acceptedExists = await this.rideRequestRepository.existsAcceptedRequestInGroup(requestGroupId);
            if (acceptedExists) {
                Logger_1.Logger.info("Accepted request already exists; timeout ignored", {
                    requestGroupId,
                    requestId,
                });
                return;
            }
            const expiredRequest = await this.rideRequestRepository.atomicExpireRideRequest(requestId);
            if (!expiredRequest) {
                Logger_1.Logger.info("Request was not pending at timeout; skipping", {
                    requestId,
                    requestGroupId,
                });
                return;
            }
            await this.eventBus.publish({
                type: "RideRequestExpiredForDriver",
                occurredAt: new Date(),
                payload: {
                    requestId: expiredRequest.getId(),
                    requestGroupId,
                    driverId: expiredRequest.getDriverId(),
                    driverUserId: expiredRequest.getDriverUserId(),
                    riderId: group.getRiderId(),
                    expiredAt: new Date().toISOString(),
                },
            });
            const nextIndex = currentIndex + 1;
            const totalCandidates = group.getCandidateDriverIds().length;
            if (nextIndex >= totalCandidates) {
                await this.rideRequestGroupRepository.updateStatus(requestGroupId, RideRequestGroupStatus_1.RideRequestGroupStatus.EXPIRED);
                const exhaustedEvent = {
                    type: "RideRequestGroupExhausted",
                    occurredAt: new Date(),
                    payload: {
                        requestGroupId,
                        riderId: group.getRiderId(),
                        reason: "No drivers accepted the request in time",
                    },
                };
                await this.eventBus.publish(exhaustedEvent);
                const publisher = (0, RedisPubSubClient_1.createRedisPubSubSubscriber)();
                await publisher.connect();
                await publisher.publish(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND, JSON.stringify({
                    riderId: group.getRiderId(),
                    requestGroupId,
                    reason: "No drivers accepted the request in time",
                }));
                await publisher.disconnect();
                await this.rideSearchDispatchService.publishSearchProgress({
                    requestGroupId,
                    riderId: group.getRiderId(),
                    currentIndex,
                    totalCandidates,
                    message: "No drivers found nearby.",
                    status: "EXPIRED",
                });
                await this.rideSearchDispatchService.cancelGroupJobs(requestGroupId);
                return;
            }
            await this.rideRequestGroupRepository.updateCurrentIndex(requestGroupId, nextIndex);
            await this.rideSearchDispatchService.publishSearchProgress({
                requestGroupId,
                riderId: group.getRiderId(),
                currentIndex: nextIndex,
                totalCandidates,
                message: "Finding another nearby driver...",
                status: "SEARCHING",
            });
            await this.rideSearchDispatchService.dispatchNextRequest(requestGroupId, nextIndex);
        }
        finally {
            await this.lockService.releaseLock(lockKey, lockToken);
        }
    }
    async handleGroupNotifyNoDriver(job) {
        const { requestGroupId } = job.data;
        const group = await this.rideRequestGroupRepository.findActiveById(requestGroupId);
        if (!group)
            return;
        const acceptedExists = await this.rideRequestRepository.existsAcceptedRequestInGroup(requestGroupId);
        if (acceptedExists)
            return;
        await this.rideSearchDispatchService.publishSearchProgress({
            requestGroupId,
            riderId: group.getRiderId(),
            currentIndex: group.getCurrentIndex(),
            totalCandidates: group.getCandidateDriverIds().length,
            message: "Still searching for a driver nearby...",
            status: "SEARCHING",
        });
    }
    async handleGroupHardExpire(job) {
        const { requestGroupId } = job.data;
        const group = await this.rideRequestGroupRepository.findActiveById(requestGroupId);
        if (!group)
            return;
        const acceptedExists = await this.rideRequestRepository.existsAcceptedRequestInGroup(requestGroupId);
        if (acceptedExists)
            return;
        const latestPending = await this.rideRequestRepository.findLatestPendingByGroupId(requestGroupId);
        if (latestPending) {
            await this.rideRequestRepository.atomicExpireRideRequest(latestPending.getId());
        }
        await this.rideRequestGroupRepository.updateStatus(requestGroupId, RideRequestGroupStatus_1.RideRequestGroupStatus.EXPIRED);
        const exhaustedEvent = {
            type: "RideRequestGroupExhausted",
            occurredAt: new Date(),
            payload: {
                requestGroupId,
                riderId: group.getRiderId(),
                reason: "Search timed out without a driver match",
            },
        };
        await this.eventBus.publish(exhaustedEvent);
        const publisher = (0, RedisPubSubClient_1.createRedisPubSubSubscriber)();
        await publisher.connect();
        await publisher.publish(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND, JSON.stringify({
            riderId: group.getRiderId(),
            requestGroupId,
            reason: "Search timed out without a driver match",
        }));
        await publisher.disconnect();
        await this.rideSearchDispatchService.publishSearchProgress({
            requestGroupId,
            riderId: group.getRiderId(),
            currentIndex: group.getCurrentIndex(),
            totalCandidates: group.getCandidateDriverIds().length,
            message: "No drivers found nearby.",
            status: "EXPIRED",
        });
        await this.rideSearchDispatchService.cancelGroupJobs(requestGroupId);
    }
};
exports.RideRequestTimeoutWorker = RideRequestTimeoutWorker;
exports.RideRequestTimeoutWorker = RideRequestTimeoutWorker = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestGroupRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RideSearchDispatchService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.DistributedLockService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RideRequestTimeoutWorker);
//# sourceMappingURL=RideRequestTimeoutWorker.js.map