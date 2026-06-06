"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChat = void 0;
class UserChat {
    constructor(id, userId, chatRoomId, lastSeenMessageId, unreadCount = 0, isMuted = false, isPinned = false, lastMessageAt, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.userId = userId;
        this.chatRoomId = chatRoomId;
        this.lastSeenMessageId = lastSeenMessageId;
        this.unreadCount = unreadCount;
        this.isMuted = isMuted;
        this.isPinned = isPinned;
        this.lastMessageAt = lastMessageAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        if (!params.id || !params.userId || !params.chatRoomId) {
            throw new Error("Invalid UserChat creation parameters");
        }
        return new UserChat(params.id, params.userId, params.chatRoomId);
    }
    static fromData(data) {
        return new UserChat(data.id, data.userId, data.chatRoomId, data.lastSeenMessageId, data.unreadCount, data.isMuted, data.isPinned, data.lastMessageAt, data.createdAt, data.updatedAt);
    }
    incrementUnread() {
        this.unreadCount += 1;
        this.updatedAt = new Date();
    }
    markAsRead(messageId) {
        if (!messageId) {
            throw new Error("MessageId is required");
        }
        this.lastSeenMessageId = messageId;
        this.unreadCount = 0;
        this.updatedAt = new Date();
    }
    updateLastMessage(timestamp) {
        this.lastMessageAt = timestamp;
        this.updatedAt = new Date();
    }
    mute() {
        if (this.isMuted)
            return;
        this.isMuted = true;
        this.updatedAt = new Date();
    }
    unmute() {
        if (!this.isMuted)
            return;
        this.isMuted = false;
        this.updatedAt = new Date();
    }
    pin() {
        if (this.isPinned)
            return;
        this.isPinned = true;
        this.updatedAt = new Date();
    }
    unpin() {
        if (!this.isPinned)
            return;
        this.isPinned = false;
        this.updatedAt = new Date();
    }
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getChatRoomId() {
        return this.chatRoomId;
    }
    getLastSeenMessageId() {
        return this.lastSeenMessageId;
    }
    getUnreadCount() {
        return this.unreadCount;
    }
    isMutedEnabled() {
        return this.isMuted;
    }
    isPinnedEnabled() {
        return this.isPinned;
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
exports.UserChat = UserChat;
//# sourceMappingURL=UserChat.js.map