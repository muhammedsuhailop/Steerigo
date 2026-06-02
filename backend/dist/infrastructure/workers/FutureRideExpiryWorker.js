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
exports.FutureRideExpiryWorker = void 0;
const bullmq_1 = require("bullmq");
const inversify_1 = require("inversify");
const DITypes_1 = require("../../shared/constants/DITypes");
const BullMQConnection_1 = require("../queues/BullMQConnection");
const AppConstants_1 = require("../../shared/constants/AppConstants");
const Logger_1 = require("../../shared/utils/Logger");
const FutureRideRequestStatus_1 = require("../../domain/value-objects/FutureRideRequestStatus");
let FutureRideExpiryWorker = class FutureRideExpiryWorker {
    constructor(futureRideRequestRepository, eventBus) {
        this.futureRideRequestRepository = futureRideRequestRepository;
        this.eventBus = eventBus;
    }
    start() {
        this.worker = new bullmq_1.Worker(AppConstants_1.AppConstants.FUTURE_RIDE_EXPIRY_QUEUE_NAME, async (job) => this.process(job), {
            connection: (0, BullMQConnection_1.getBullMQConnection)(),
            concurrency: 5,
        });
        this.worker.on("completed", (job) => {
            Logger_1.Logger.info("Future ride expiry job completed", {
                jobId: job.id,
                name: job.name,
            });
        });
        this.worker.on("failed", (job, error) => {
            Logger_1.Logger.error("Future ride expiry job failed", {
                jobId: job?.id,
                name: job?.name,
                error: error.message,
            });
        });
        Logger_1.Logger.info("FutureRideExpiryWorker started");
    }
    async close() {
        await this.worker?.close();
    }
    async process(job) {
        switch (job.name) {
            case AppConstants_1.AppConstants.FUTURE_RIDE_EXPIRY_JOB_NAME:
                await this.handleGroupExpiry(job);
                return;
            default:
                Logger_1.Logger.warn("Unknown future ride expiry job received", {
                    jobId: job.id,
                    name: job.name,
                });
        }
    }
    async handleGroupExpiry(job) {
        const { requestGroupId } = job.data;
        Logger_1.Logger.info("Future ride expiry guard triggered", {
            jobId: job.id,
            requestGroupId,
        });
        const alreadyAccepted = await this.futureRideRequestRepository.existsAcceptedInGroup(requestGroupId);
        if (alreadyAccepted) {
            Logger_1.Logger.info("Future ride group already accepted before expiry — skipping", { requestGroupId });
            return;
        }
        const requests = await this.futureRideRequestRepository.findByRequestGroupId(requestGroupId);
        const riderId = requests[0]?.getRiderId() ?? "";
        const activeRequestsBeforeExpiry = requests.filter((request) => request.getStatus() === FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING ||
            request.getStatus() === FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED);
        const cancelledCount = await this.futureRideRequestRepository.markExpiredAllPendingInGroup(requestGroupId);
        Logger_1.Logger.info("Future ride group expired — no driver accepted within expiry window", { requestGroupId, cancelledCount });
        await this.eventBus.publish({
            type: "FutureRideExpired",
            occurredAt: new Date(),
            payload: { requestGroupId, riderId, cancelledCount },
        });
        await Promise.all(activeRequestsBeforeExpiry.map((request) => this.eventBus.publish({
            type: "FutureRideRequestExpiredForDriver",
            occurredAt: new Date(),
            payload: {
                futureRequestId: request.getId(),
                requestGroupId,
                driverId: request.getDriverId(),
                driverUserId: request.getDriverUserId(),
                riderId: request.getRiderId(),
                pickupTime: request.getPickupTime().toISOString(),
            },
        })));
    }
};
exports.FutureRideExpiryWorker = FutureRideExpiryWorker;
exports.FutureRideExpiryWorker = FutureRideExpiryWorker = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideRequestRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object])
], FutureRideExpiryWorker);
//# sourceMappingURL=FutureRideExpiryWorker.js.map