"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const MessageType_1 = require("@domain/value-objects/MessageType");
class Message {
    constructor(id, chatRoomId, senderId, content, type, metadata, createdAt = new Date(), updatedAt = new Date(), editedAt, deletedAt) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.content = content;
        this.type = type;
        this.metadata = metadata;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.editedAt = editedAt;
        this.deletedAt = deletedAt;
    }
    static create(params) {
        if (!params.id || !params.chatRoomId || !params.senderId) {
            throw new Error("Invalid Message creation parameters");
        }
        const type = params.type ?? MessageType_1.MessageType.TEXT;
        const normalizedContent = params.content.trim();
        if (type === MessageType_1.MessageType.TEXT && !normalizedContent) {
            throw new Error("Text message cannot be empty");
        }
        if (type === MessageType_1.MessageType.IMAGE && !params.metadata?.imageUrl) {
            throw new Error("Image message must have imageUrl");
        }
        if (type === MessageType_1.MessageType.LOCATION &&
            (params.metadata?.latitude === undefined ||
                params.metadata?.longitude === undefined)) {
            throw new Error("Location message must have latitude and longitude");
        }
        return new Message(params.id, params.chatRoomId, params.senderId, normalizedContent, type, params.metadata ?? {});
    }
    static fromData(data) {
        return new Message(data.id, data.chatRoomId, data.senderId, data.content, data.type, data.metadata, data.createdAt, data.updatedAt, data.editedAt, data.deletedAt);
    }
    edit(newContent, now = new Date()) {
        if (this.deletedAt) {
            throw new Error("Cannot edit deleted message");
        }
        if (!this.canBeEdited(now)) {
            throw new Error("Message edit window has expired");
        }
        const normalizedContent = newContent.trim();
        if (!normalizedContent) {
            throw new Error("Message content cannot be empty");
        }
        this.content = normalizedContent;
        this.editedAt = now;
        this.updatedAt = now;
    }
    delete() {
        if (this.deletedAt)
            return;
        this.deletedAt = new Date();
        this.updatedAt = new Date();
    }
    isDeleted() {
        return !!this.deletedAt;
    }
    getId() {
        return this.id;
    }
    getChatRoomId() {
        return this.chatRoomId;
    }
    getSenderId() {
        return this.senderId;
    }
    getContent() {
        return this.content;
    }
    getType() {
        return this.type;
    }
    getMetadata() {
        return { ...this.metadata };
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    getEditedAt() {
        return this.editedAt;
    }
    getDeletedAt() {
        return this.deletedAt;
    }
    canBeEdited(now = new Date()) {
        if (this.deletedAt) {
            return false;
        }
        return now.getTime() - this.createdAt.getTime() <= Message.EDIT_WINDOW_MS;
    }
}
exports.Message = Message;
Message.EDIT_WINDOW_MS = 2 * 60 * 1000;
//# sourceMappingURL=Message.js.map