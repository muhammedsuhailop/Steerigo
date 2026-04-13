import { Types } from "mongoose";
import { UserChat } from "@domain/entities/UserChat";
import { IUserChatDocument } from "../models/UserChatMode";

export class UserChatMapper {
  static toDomain(doc: IUserChatDocument): UserChat {
    return UserChat.fromData({
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

  static toPersistence(entity: UserChat): Partial<IUserChatDocument> {
    return {
      userId: new Types.ObjectId(entity.getUserId()),
      chatRoomId: new Types.ObjectId(entity.getChatRoomId()),

      lastSeenMessageId: entity.getLastSeenMessageId()
        ? new Types.ObjectId(entity.getLastSeenMessageId())
        : undefined,

      unreadCount: entity.getUnreadCount(),

      isMuted: entity.isMutedEnabled(),
      isPinned: entity.isPinnedEnabled(),

      lastMessageAt: entity.getLastMessageAt(),

      updatedAt: entity.getUpdatedAt(),
    };
  }
}
