"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomMapper = void 0;
const mongoose_1 = require("mongoose");
const ChatRoom_1 = require("../../../domain/entities/ChatRoom");
class ChatRoomMapper {
    static toDomain(doc) {
        return ChatRoom_1.ChatRoom.fromData({
            id: doc._id.toString(),
            type: doc.type,
            rideId: doc.rideId ? doc.rideId.toString() : undefined,
            participants: doc.participants.map((p) => ({
                userId: p.userId.toString(),
                role: p.role,
            })),
            status: doc.status,
            lastMessageId: doc.lastMessageId
                ? doc.lastMessageId.toString()
                : undefined,
            lastMessageAt: doc.lastMessageAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        return {
            type: entity.getType(),
            rideId: entity.getRideId(),
            participants: entity.getParticipants().map((p) => ({
                userId: new mongoose_1.Types.ObjectId(p.userId),
                role: p.role,
            })),
            status: entity.getStatus(),
            lastMessageId: entity.getLastMessageId()
                ? new mongoose_1.Types.ObjectId(entity.getLastMessageId())
                : undefined,
            lastMessageAt: entity.getLastMessageAt(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.ChatRoomMapper = ChatRoomMapper;
//# sourceMappingURL=ChatRoomMapper.js.map