"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChatMapper = void 0;
const mongoose_1 = require("mongoose");
const UserChat_1 = require("@domain/entities/UserChat");
class UserChatMapper {
    static toDomain(doc) {
        return UserChat_1.UserChat.fromData({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            chatRoomId: doc.chatRoomId.toString(),
            lastSeenMessageId: doc.lastSeenMessageId?.toString(),
            unreadCount: doc.unreadCount,
            isMuted: doc.isMuted,
            isPinned: doc.isPinned,
            lastMessageAt: doc.lastMessageAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        return {
            userId: new mongoose_1.Types.ObjectId(entity.getUserId()),
            chatRoomId: new mongoose_1.Types.ObjectId(entity.getChatRoomId()),
            lastSeenMessageId: entity.getLastSeenMessageId()
                ? new mongoose_1.Types.ObjectId(entity.getLastSeenMessageId())
                : undefined,
            unreadCount: entity.getUnreadCount(),
            isMuted: entity.isMutedEnabled(),
            isPinned: entity.isPinnedEnabled(),
            lastMessageAt: entity.getLastMessageAt(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.UserChatMapper = UserChatMapper;
//# sourceMappingURL=UserChatMapper.js.map