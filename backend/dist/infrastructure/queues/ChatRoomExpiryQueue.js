"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatRoomExpiryQueue = void 0;
const bullmq_1 = require("bullmq");
const BullMQConnection_1 = require("../queues/BullMQConnection");
const AppConstants_1 = require("../../shared/constants/AppConstants");
const createChatRoomExpiryQueue = () => new bullmq_1.Queue(AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_QUEUE_NAME, {
    connection: (0, BullMQConnection_1.getBullMQConnection)(),
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
    },
});
exports.createChatRoomExpiryQueue = createChatRoomExpiryQueue;
//# sourceMappingURL=ChatRoomExpiryQueue.js.map