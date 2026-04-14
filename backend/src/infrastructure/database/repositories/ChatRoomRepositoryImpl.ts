import { injectable } from "inversify";
import { Types, FilterQuery, SortOrder } from "mongoose";
import {
  IChatRoomPaginationOptions,
  IChatRoomRepository,
} from "@domain/repositories/IChatRoomRepository";
import { ChatRoom } from "@domain/entities/ChatRoom";
import { ChatRoomModel, IChatRoomDocument } from "../models/ChatRoomModel";
import { ChatRoomMapper } from "../mappers/ChatRoomMapper";
import { Logger } from "@shared/utils/Logger";
import { PaginatedResult } from "@shared/types/Repository";

@injectable()
export class ChatRoomRepositoryImpl implements IChatRoomRepository {
  async findById(id: string): Promise<ChatRoom | null> {
    try {
      const doc = await ChatRoomModel.findById(id);
      return doc ? ChatRoomMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding chat room by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await ChatRoomModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking chat room existence", { id, error });
      throw error;
    }
  }

  async save(entity: ChatRoom): Promise<ChatRoom> {
    try {
      const data = ChatRoomMapper.toPersistence(entity);

      const doc = await ChatRoomModel.findOneAndUpdate(
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
        throw new Error("Failed to save chat room");
      }

      Logger.info("ChatRoom saved successfully", {
        id: doc._id.toString(),
        type: doc.type,
      });

      return ChatRoomMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving chat room", {
        id: entity.getId(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await ChatRoomModel.findByIdAndDelete(id);

      if (result) {
        Logger.info("ChatRoom deleted", { id });
      } else {
        Logger.warn("ChatRoom not found for deletion", { id });
      }
    } catch (error) {
      Logger.error("Error deleting chat room", { id, error });
      throw error;
    }
  }

  async findByRideId(rideId: string): Promise<ChatRoom | null> {
    try {
      const doc = await ChatRoomModel.findOne({
        rideId: new Types.ObjectId(rideId),
      });

      return doc ? ChatRoomMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding chat room by rideId", {
        rideId,
        error,
      });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<ChatRoom[]> {
    try {
      const docs = await ChatRoomModel.find({
        "participants.userId": new Types.ObjectId(userId),
      }).sort({ lastMessageAt: -1 });

      return docs.map(ChatRoomMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding chat rooms by userId", {
        userId,
        error,
      });
      throw error;
    }
  }

  async findPaginatedByUserId(
    userId: string,
    options: IChatRoomPaginationOptions,
  ): Promise<PaginatedResult<ChatRoom>> {
    try {
      const { page, limit, sortOrder, type } = options;

      const query: FilterQuery<IChatRoomDocument> = {
        "participants.userId": new Types.ObjectId(userId),
      };

      if (type) {
        query.type = type;
      }

      const sortValue: Record<string, SortOrder> = {
        lastMessageAt: sortOrder === "asc" ? 1 : -1,
      };

      const total = await ChatRoomModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await ChatRoomModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(ChatRoomMapper.toDomain);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      Logger.error("Error finding paginated chat rooms by userId", {
        userId,
        options,
        error,
      });
      throw error;
    }
  }
}
