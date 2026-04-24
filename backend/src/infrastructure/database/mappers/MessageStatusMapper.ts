import { Types } from "mongoose";
import { MessageStatus } from "@domain/entities/MessageStatus";
import { IMessageStatusDocument } from "../models/MessageStatusModel";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";

export class MessageStatusMapper {
  static toDomain(doc: IMessageStatusDocument): MessageStatus {
    return MessageStatus.fromData({
      id: doc._id.toString(),
      messageId: doc.messageId.toString(),
      userId: doc.userId.toString(),
      status: doc.status as MessageDeliveryStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: MessageStatus): Partial<IMessageStatusDocument> {
    return {
      messageId: new Types.ObjectId(entity.getMessageId()),
      userId: new Types.ObjectId(entity.getUserId()),
      status: entity.getStatus(),

      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
