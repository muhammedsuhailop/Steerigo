import { injectable } from "inversify";
import { Types, FilterQuery, SortOrder } from "mongoose";
import {
  IMessageRepository,
  IMessagePaginationOptions,
} from "@domain/repositories/IMessageRepository";
import { Message } from "@domain/entities/Message";
import { MessageModel, IMessageDocument } from "../models/MessageModel";
import { MessageMapper } from "../mappers/MessageMapper";
import { PaginatedResult } from "@shared/types/Repository";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class MessageRepositoryImpl implements IMessageRepository {
  async findById(id: string): Promise<Message | null> {
    try {
      const doc = await MessageModel.findById(id);
      return doc ? MessageMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding message by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await MessageModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking message existence", { id, error });
      throw error;
    }
  }

  async save(entity: Message): Promise<Message> {
    try {
      const data = MessageMapper.toPersistence(entity);

      const doc = await MessageModel.findOneAndUpdate(
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
        throw new Error("Failed to save message");
      }

      return MessageMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving message", {
        id: entity.getId(),
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await MessageModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.error("Error deleting message", { id, error });
      throw error;
    }
  }

  async findByChatRoomId(chatRoomId: string): Promise<Message[]> {
    try {
      const docs = await MessageModel.find({
        chatRoomId: new Types.ObjectId(chatRoomId),
      }).sort({ createdAt: -1 });

      return docs.map(MessageMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding messages by chatRoomId", {
        chatRoomId,
        error,
      });
      throw error;
    }
  }

  async findPaginatedByChatRoomId(
    chatRoomId: string,
    options: IMessagePaginationOptions,
  ): Promise<PaginatedResult<Message>> {
    try {
      const { page, limit, sortOrder, type } = options;

      const query: FilterQuery<IMessageDocument> = {
        chatRoomId: new Types.ObjectId(chatRoomId),
      };

      if (type) {
        query.type = type;
      }

      const sortValue: Record<string, SortOrder> = {
        createdAt: sortOrder === "asc" ? 1 : -1,
      };

      const total = await MessageModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await MessageModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(MessageMapper.toDomain);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      Logger.error("Error finding paginated messages", {
        chatRoomId,
        options,
        error,
      });
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const now = new Date();

      await MessageModel.findByIdAndUpdate(
        id,
        {
          $set: {
            deletedAt: now,
            updatedAt: now,
          },
        },
        {
          runValidators: true,
        },
      ).exec();
    } catch (error) {
      Logger.error("Error soft deleting message", { id, error });
      throw error;
    }
  }
}
