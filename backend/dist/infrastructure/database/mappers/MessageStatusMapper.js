"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatusMapper = void 0;
const mongoose_1 = require("mongoose");
const MessageStatus_1 = require("@domain/entities/MessageStatus");
class MessageStatusMapper {
    static toDomain(doc) {
        return MessageStatus_1.MessageStatus.fromData({
            id: doc._id.toString(),
            messageId: doc.messageId.toString(),
            userId: doc.userId.toString(),
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        return {
            messageId: new mongoose_1.Types.ObjectId(entity.getMessageId()),
            userId: new mongoose_1.Types.ObjectId(entity.getUserId()),
            status: entity.getStatus(),
            createdAt: entity.getCreatedAt(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.MessageStatusMapper = MessageStatusMapper;
//# sourceMappingURL=MessageStatusMapper.js.map