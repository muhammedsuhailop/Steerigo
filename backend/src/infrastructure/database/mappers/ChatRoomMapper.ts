import { Types } from "mongoose";
import { ChatRoom } from "@domain/entities/ChatRoom";
import { IChatRoomDocument } from "../models/ChatRoomModel";
import { ChatRoomStatus } from "@domain/value-objects/ChatRoomStatus";

export class ChatRoomMapper {
  static toDomain(doc: IChatRoomDocument): ChatRoom {
    return ChatRoom.fromData({
      id: doc._id.toString(),

      type: doc.type,

      rideId: doc.rideId ? doc.rideId.toString() : undefined,

      participants: doc.participants.map((p) => ({
        userId: p.userId.toString(),
        role: p.role,
      })),

      status: doc.status as ChatRoomStatus,

      lastMessageId: doc.lastMessageId
        ? doc.lastMessageId.toString()
        : undefined,

      lastMessageAt: doc.lastMessageAt,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: ChatRoom): Partial<IChatRoomDocument> {
    return {
      type: entity.getType(),

      rideId: entity.getRideId(),

      participants: entity.getParticipants().map((p) => ({
        userId: new Types.ObjectId(p.userId),
        role: p.role,
      })),

      status: entity.getStatus(),

      lastMessageId: entity.getLastMessageId()
        ? new Types.ObjectId(entity.getLastMessageId())
        : undefined,

      lastMessageAt: entity.getLastMessageAt(),

      updatedAt: entity.getUpdatedAt(),
    };
  }
}
