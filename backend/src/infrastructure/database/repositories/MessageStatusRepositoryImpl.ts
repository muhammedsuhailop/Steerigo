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

      await MessageStatusModel.updateOne(filter, {
        status,
        updatedAt: new Date(),
      });
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
}
