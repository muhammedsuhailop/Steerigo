"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomModel = void 0;
const mongoose_1 = require("mongoose");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const ChatRoomStatus_1 = require("../../../domain/value-objects/ChatRoomStatus");
const chatRoomSchema = new mongoose_1.Schema({
    rideId: {
        type: String,
        ref: "Ride",
        required: true,
        unique: true,
        index: true,
    },
    participants: [
        {
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            role: {
                type: String,
                enum: AuthConstants_1.UserRole,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: Object.values(ChatRoomStatus_1.ChatRoomStatus),
        default: ChatRoomStatus_1.ChatRoomStatus.ACTIVE,
        index: true,
    },
    lastMessageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message",
    },
    lastMessageAt: {
        type: Date,
        index: true,
    },
}, { timestamps: true });
chatRoomSchema.index({ "participants.userId": 1 });
exports.ChatRoomModel = (0, mongoose_1.model)("ChatRoom", chatRoomSchema);
//# sourceMappingURL=ChatRoomModel.js.map