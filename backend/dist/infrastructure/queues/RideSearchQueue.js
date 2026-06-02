"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideSearchQueue = void 0;
const bullmq_1 = require("bullmq");
const BullMQConnection_1 = require("./BullMQConnection");
const RideSearchQueueConstants_1 = require("@shared/constants/RideSearchQueueConstants");
exports.rideSearchQueue = new bullmq_1.Queue(RideSearchQueueConstants_1.RIDE_SEARCH_QUEUE.NAME, {
    connection: (0, BullMQConnection_1.getBullMQConnection)(),
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
    },
});
//# sourceMappingURL=RideSearchQueue.js.map