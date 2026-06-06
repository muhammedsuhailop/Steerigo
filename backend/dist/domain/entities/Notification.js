"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
class Notification {
    constructor(id, recipientId, type, channel, title, body, metadata, isRead, readAt, createdAt, updatedAt) {
        this.id = id;
        this.recipientId = recipientId;
        this.type = type;
        this.channel = channel;
        this.title = title;
        this.body = body;
        this.metadata = metadata;
        this.isRead = isRead;
        this.readAt = readAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(data) {
        if (!data.id || !data.recipientId) {
            throw new Error("Notification id and recipientId are required");
        }
        if (!data.title.trim() || !data.body.trim()) {
            throw new Error("Notification title and body are required");
        }
        return new Notification(data.id, data.recipientId, data.type, data.channel, data.title.trim(), data.body.trim(), data.metadata ?? {}, false, undefined, new Date(), new Date());
    }
    static fromData(data) {
        return new Notification(data.id, data.recipientId, data.type, data.channel, data.title, data.body, data.metadata, data.isRead, data.readAt, data.createdAt, data.updatedAt);
    }
    // Getters
    getId() {
        return this.id;
    }
    getRecipientId() {
        return this.recipientId;
    }
    getType() {
        return this.type;
    }
    getChannel() {
        return this.channel;
    }
    getTitle() {
        return this.title;
    }
    getBody() {
        return this.body;
    }
    getMetadata() {
        return { ...this.metadata };
    }
    getIsRead() {
        return this.isRead;
    }
    getReadAt() {
        return this.readAt;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    // Business methods
    markAsRead() {
        if (this.isRead)
            return;
        this.isRead = true;
        this.readAt = new Date();
        this.updatedAt = new Date();
    }
    isUnread() {
        return !this.isRead;
    }
}
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map