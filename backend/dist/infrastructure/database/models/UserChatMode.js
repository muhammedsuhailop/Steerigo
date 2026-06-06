"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChatModel = void 0;
const mongoose_1 = require("mongoose");
const userChatSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    chatRoomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
    },
    lastSeenMessageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message",
    },
    unreadCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    isMuted: {
        type: Boolean,
        default: false,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    lastMessageAt: {
        type: Date,
        index: true,
    },
}, {
    timestamps: true,
    collection: "user_chats",
});
userChatSchema.index({ userId: 1, chatRoomId: 1 }, { unique: true });
userChatSchema.index({ userId: 1, lastMessageAt: -1 });
exports.UserChatModel = (0, mongoose_1.model)("UserChat", userChatSchema);
//# sourceMappingURL=UserChatMode.js.map