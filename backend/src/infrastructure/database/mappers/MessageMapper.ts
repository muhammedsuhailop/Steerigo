import { Types } from "mongoose";
import { Message } from "@domain/entities/Message";
import { IMessageDocument } from "../models/MessageModel";
import { MessageType } from "@domain/value-objects/MessageType";

export class MessageMapper {
  static toDomain(doc: IMessageDocument): Message {
    return Message.fromData({
      id: doc._id.toString(),
      chatRoomId: doc.chatRoomId.toString(),
      senderId: doc.senderId.toString(),

      content: doc.content,
      type: doc.type as MessageType,

      metadata: doc.metadata ?? {},

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,

      editedAt: doc.editedAt,
      deletedAt: doc.deletedAt,
    });
  }

  static toPersistence(entity: Message): Partial<IMessageDocument> {
    return {
      chatRoomId: new Types.ObjectId(entity.getChatRoomId()),
      senderId: new Types.ObjectId(entity.getSenderId()),

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
