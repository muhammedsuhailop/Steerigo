"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
const ChatRoomStatus_1 = require("../value-objects/ChatRoomStatus");
const ChatRoomType_1 = require("../value-objects/ChatRoomType");
class ChatRoom {
    constructor(id, type, rideId, participants, status, lastMessageId, lastMessageAt, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.type = type;
        this.rideId = rideId;
        this.participants = participants;
        this.status = status;
        this.lastMessageId = lastMessageId;
        this.lastMessageAt = lastMessageAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        if (!params.id || !params.type) {
            throw new Error("Invalid ChatRoom creation parameters");
        }
        if (!params.participants || params.participants.length < 2) {
            throw new Error("ChatRoom must have at least 2 participants");
        }
        if (params.type === ChatRoomType_1.ChatRoomType.RIDE && !params.rideId) {
            throw new Error("Ride chat must have rideId");
        }
        return new ChatRoom(params.id, params.type, params.rideId, [...params.participants], ChatRoomStatus_1.ChatRoomStatus.ACTIVE);
    }
    static fromData(data) {
        return new ChatRoom(data.id, data.type, data.rideId, [...data.participants], data.status, data.lastMessageId, data.lastMessageAt, data.createdAt, data.updatedAt);
    }
    addMessage(messageId, timestamp) {
        if (this.status === ChatRoomStatus_1.ChatRoomStatus.ENDED) {
            throw new Error("Cannot add message to ended chat");
        }
        this.lastMessageId = messageId;
        this.lastMessageAt = timestamp;
        this.updatedAt = new Date();
    }
    end() {
        if (this.status === ChatRoomStatus_1.ChatRoomStatus.ENDED)
            return;
        this.status = ChatRoomStatus_1.ChatRoomStatus.ENDED;
        this.updatedAt = new Date();
    }
    isParticipant(userId) {
        return this.participants.some((p) => String(p.userId) === String(userId));
    }
    getId() {
        return this.id;
    }
    getType() {
        return this.type;
    }
    getRideId() {
        return this.rideId;
    }
    getParticipants() {
        return [...this.participants];
    }
    getStatus() {
        return this.status;
    }
    getLastMessageId() {
        return this.lastMessageId;
    }
    getLastMessageAt() {
        return this.lastMessageAt;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.ChatRoom = ChatRoom;
//# sourceMappingURL=ChatRoom.js.map