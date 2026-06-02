"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatusModel = void 0;
const MessageDeliveryStatus_1 = require("@domain/value-objects/MessageDeliveryStatus");
const mongoose_1 = require("mongoose");
const messageStatusSchema = new mongoose_1.Schema({
    messageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(MessageDeliveryStatus_1.MessageDeliveryStatus),
        required: true,
    },
}, { timestamps: { createdAt: true, updatedAt: true } });
messageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true });
exports.MessageStatusModel = (0, mongoose_1.model)("MessageStatus", messageStatusSchema);
//# sourceMappingURL=MessageStatusModel.js.map