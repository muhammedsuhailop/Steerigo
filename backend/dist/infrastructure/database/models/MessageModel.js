"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const MessageType_1 = require("@domain/value-objects/MessageType");
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    chatRoomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: { type: String },
    type: {
        type: String,
        enum: Object.values(MessageType_1.MessageType),
        default: MessageType_1.MessageType.TEXT,
    },
    metadata: {
        imageUrl: String,
        latitude: Number,
        longitude: Number,
    },
    editedAt: Date,
    deletedAt: Date,
}, { timestamps: true });
messageSchema.index({ chatRoomId: 1, createdAt: -1 });
exports.MessageModel = (0, mongoose_1.model)("Message", messageSchema);
//# sourceMappingURL=MessageModel.js.map