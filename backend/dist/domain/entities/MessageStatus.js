"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatus = void 0;
const MessageDeliveryStatus_1 = require("@domain/value-objects/MessageDeliveryStatus");
class MessageStatus {
    constructor(id, messageId, userId, status, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.messageId = messageId;
        this.userId = userId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        if (!params.id || !params.messageId || !params.userId) {
            throw new Error("Invalid MessageStatus creation parameters");
        }
        return new MessageStatus(params.id, params.messageId, params.userId, MessageDeliveryStatus_1.MessageDeliveryStatus.SENT);
    }
    static fromData(data) {
        return new MessageStatus(data.id, data.messageId, data.userId, data.status, data.createdAt, data.updatedAt);
    }
    markDelivered() {
        if (this.status === MessageDeliveryStatus_1.MessageDeliveryStatus.READ)
            return;
        this.status = MessageDeliveryStatus_1.MessageDeliveryStatus.DELIVERED;
        this.updatedAt = new Date();
    }
    markRead() {
        if (this.status === MessageDeliveryStatus_1.MessageDeliveryStatus.READ)
            return;
        this.status = MessageDeliveryStatus_1.MessageDeliveryStatus.READ;
        this.updatedAt = new Date();
    }
    getId() {
        return this.id;
    }
    getMessageId() {
        return this.messageId;
    }
    getUserId() {
        return this.userId;
    }
    getStatus() {
        return this.status;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.MessageStatus = MessageStatus;
//# sourceMappingURL=MessageStatus.js.map