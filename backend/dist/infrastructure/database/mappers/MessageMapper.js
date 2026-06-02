"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMapper = void 0;
const mongoose_1 = require("mongoose");
const Message_1 = require("@domain/entities/Message");
class MessageMapper {
    static toDomain(doc) {
        return Message_1.Message.fromData({
            id: doc._id.toString(),
            chatRoomId: doc.chatRoomId.toString(),
            senderId: doc.senderId.toString(),
            content: doc.content,
            type: doc.type,
            metadata: doc.metadata ?? {},
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            editedAt: doc.editedAt,
            deletedAt: doc.deletedAt,
        });
    }
    static toPersistence(entity) {
        return {
            chatRoomId: new mongoose_1.Types.ObjectId(entity.getChatRoomId()),
            senderId: new mongoose_1.Types.ObjectId(entity.getSenderId()),
            content: entity.getContent(),
            type: entity.getType(),
            metadata: entity.getMetadata(),
            createdAt: entity.getCreatedAt(),
            updatedAt: entity.getUpdatedAt(),
            editedAt: entity.getEditedAt(),
            deletedAt: entity.getDeletedAt(),
        };
    }
}
exports.MessageMapper = MessageMapper;
//# sourceMappingURL=MessageMapper.js.map