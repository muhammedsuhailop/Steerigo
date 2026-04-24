import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { MessageStatus } from "@domain/entities/MessageStatus";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";
import {
  MessageStatusModel,
  IMessageStatusDocument,
} from "../models/MessageStatusModel";
import { MessageStatusMapper } from "../mappers/MessageStatusMapper";
import { Logger } from "@shared/utils/Logger";
import { MessageModel } from "../models/MessageModel";

@injectable()
export class MessageStatusRepositoryImpl implements IMessageStatusRepository {
  async findById(id: string): Promise<MessageStatus | null> {
    try {
      const doc = await MessageStatusModel.findById(id);
      return doc ? MessageStatusMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding message status by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await MessageStatusModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking message status existence", { id, error });
      throw error;
    }
  }

  async save(entity: MessageStatus): Promise<MessageStatus> {
    try {
      const data = MessageStatusMapper.toPersistence(entity);

      const doc = await MessageStatusModel.findOneAndUpdate(
        { _id: entity.getId() },
        {
          ...data,
          updatedAt: entity.getUpdatedAt(),
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      if (!doc) {
        throw new Error("Failed to save message status");
      }

      return MessageStatusMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving message status", {
        id: entity.getId(),
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await MessageStatusModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.error("Error deleting message status", { id, error });
      throw error;
    }
  }

  async findByMessageId(messageId: string): Promise<MessageStatus[]> {
    try {
      const docs = await MessageStatusModel.find({
        messageId: new Types.ObjectId(messageId),
      });

      return docs.map(MessageStatusMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding message statuses by messageId", {
        messageId,
        error,
      });
      throw error;
    }
  }

  async findByMessageIdAndUserId(
    messageId: string,
    userId: string,
  ): Promise<MessageStatus | null> {
    try {
      const doc = await MessageStatusModel.findOne({
        messageId: new Types.ObjectId(messageId),
        userId: new Types.ObjectId(userId),
      });

      return doc ? MessageStatusMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding message status by messageId & userId", {
        messageId,
        userId,
        error,
      });
      throw error;
    }
  }

  async findByMessageIdsAndUserId(
    messageIds: string[],
    userId: string,
  ): Promise<MessageStatus[]> {
    try {
      if (messageIds.length === 0) {
        return [];
      }

      const objectIds = messageIds.map(
        (messageId) => new Types.ObjectId(messageId),
      );

      const docs = await MessageStatusModel.find({
        messageId: { $in: objectIds },
        userId: new Types.ObjectId(userId),
      });

      return docs.map(MessageStatusMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding message statuses by messageIds & userId", {
        messageIds,
        userId,
        error,
      });
      throw error;
    }
  }

  async updateStatus(
    messageId: string,
    userId: string,
    status: MessageDeliveryStatus,
  ): Promise<void> {
    try {
      const filter: FilterQuery<IMessageStatusDocument> = {
        messageId: new Types.ObjectId(messageId),
        userId: new Types.ObjectId(userId),
      };

      const updateData: Partial<IMessageStatusDocument> = {
        status,
        updatedAt: new Date(),
      };

      await MessageStatusModel.updateOne(filter, updateData);
    } catch (error) {
      Logger.error("Error updating message status", {
        messageId,
        userId,
        status,
        error,
      });
      throw error;
    }
  }

  async markMessagesAsReadUpTo(
    chatRoomId: string,
    userId: string,
    messageId: string,
    readAt: Date,
  ): Promise<string[]> {
    try {
      const boundaryMessage = await MessageModel.findById(
        new Types.ObjectId(messageId),
      ).select({
        _id: 1,
        chatRoomId: 1,
        createdAt: 1,
      });

      if (!boundaryMessage) {
        Logger.warn("Boundary message not found for markMessagesAsReadUpTo", {
          chatRoomId,
          userId,
          messageId,
        });
        return [];
      }

      if (boundaryMessage.chatRoomId.toString() !== chatRoomId) {
        Logger.warn("Boundary message does not belong to chat room", {
          chatRoomId,
          userId,
          messageId,
          actualChatRoomId: boundaryMessage.chatRoomId.toString(),
        });
        return [];
      }

      const messagesInRange = await MessageModel.find({
        chatRoomId: new Types.ObjectId(chatRoomId),
        createdAt: { $lte: boundaryMessage.createdAt },
      }).select({ _id: 1 });

      const messageObjectIds = messagesInRange.map((message) => message._id);

      if (messageObjectIds.length === 0) {
        return [];
      }

      await MessageStatusModel.updateMany(
        {
          messageId: { $in: messageObjectIds },
          userId: new Types.ObjectId(userId),
          status: { $ne: MessageDeliveryStatus.READ },
        },
        {
          $set: {
            status: MessageDeliveryStatus.READ,
            readAt,
            updatedAt: readAt,
          },
        },
      );

      return messageObjectIds.map((id) => id.toString());
    } catch (error) {
      Logger.error("Error marking messages as read up to boundary", {
        chatRoomId,
        userId,
        messageId,
        error,
      });
      throw error;
    }
  }
}
