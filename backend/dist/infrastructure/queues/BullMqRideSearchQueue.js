"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqRideSearchQueue = void 0;
const inversify_1 = require("inversify");
const RideSearchQueue_1 = require("./RideSearchQueue");
const AppConstants_1 = require("@shared/constants/AppConstants");
const RideSearchQueueConstants_1 = require("@shared/constants/RideSearchQueueConstants");
let BullMqRideSearchQueue = class BullMqRideSearchQueue {
    async scheduleRequestTimeout(data) {
        await RideSearchQueue_1.rideSearchQueue.add(RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.JOBS.REQUEST_TIMEOUT, data, {
            delay: AppConstants_1.AppConstants.RIDE_REQUEST_TIMEOUT_MS,
            jobId: `ride-request-timeout-${data.requestId}`,
        });
    }
    async scheduleNoDriverNotification(data) {
        await RideSearchQueue_1.rideSearchQueue.add(RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.JOBS.GROUP_NOTIFY_NO_DRIVER, data, {
            delay: AppConstants_1.AppConstants.RIDE_SEARCH_NOTIFY_NO_DRIVER_MS,
            jobId: `ride-group-notify-${data.requestGroupId}`,
        });
    }
    async scheduleHardExpire(data) {
        await RideSearchQueue_1.rideSearchQueue.add(RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.JOBS.GROUP_HARD_EXPIRE, data, {
            delay: AppConstants_1.AppConstants.RIDE_SEARCH_HARD_EXPIRE_MS,
            jobId: `ride-group-hard-expire-${data.requestGroupId}`,
        });
    }
    async cancelRequestTimeout(requestId) {
        const job = await RideSearchQueue_1.rideSearchQueue.getJob(`ride-request-timeout-${requestId}`);
        await job?.remove();
    }
    async cancelGroupJobs(requestGroupId) {
        const notifyJob = await RideSearchQueue_1.rideSearchQueue.getJob(`ride-group-notify-${requestGroupId}`);
        await notifyJob?.remove();
        const hardExpireJob = await RideSearchQueue_1.rideSearchQueue.getJob(`ride-group-hard-expire-${requestGroupId}`);
        await hardExpireJob?.remove();
    }
};
exports.BullMqRideSearchQueue = BullMqRideSearchQueue;
exports.BullMqRideSearchQueue = BullMqRideSearchQueue = __decorate([
    (0, inversify_1.injectable)()
], BullMqRideSearchQueue);
//# sourceMappingURL=BullMqRideSearchQueue.js.map