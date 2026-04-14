import { injectable } from "inversify";
import { Types, FilterQuery, SortOrder } from "mongoose";
import {
  IUserChatRepository,
  IUserChatPaginationOptions,
} from "@domain/repositories/IUserChatRepository";
import { UserChat } from "@domain/entities/UserChat";
import { UserChatMapper } from "../mappers/UserChatMapper";
import { PaginatedResult } from "@shared/types/Repository";
import { Logger } from "@shared/utils/Logger";
import { IUserChatDocument, UserChatModel } from "../models/UserChatMode";

@injectable()
export class UserChatRepositoryImpl implements IUserChatRepository {
  async findById(id: string): Promise<UserChat | null> {
    try {
      const doc = await UserChatModel.findById(id);
      return doc ? UserChatMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding user chat by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await UserChatModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking user chat existence", { id, error });
      throw error;
    }
  }

  async save(entity: UserChat): Promise<UserChat> {
    try {
      const data = UserChatMapper.toPersistence(entity);

      const doc = await UserChatModel.findOneAndUpdate(
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
        throw new Error("Failed to save user chat");
      }

      return UserChatMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving user chat", {
        id: entity.getId(),
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await UserChatModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.error("Error deleting user chat", { id, error });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<UserChat[]> {
    try {
      const docs = await UserChatModel.find({
        userId: new Types.ObjectId(userId),
      }).sort({ lastMessageAt: -1 });

      return docs.map(UserChatMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding user chats by userId", {
        userId,
        error,
      });
      throw error;
    }
  }

  async findByUserIdAndChatRoomId(
    userId: string,
    chatRoomId: string,
  ): Promise<UserChat | null> {
    try {
      const doc = await UserChatModel.findOne({
        userId: new Types.ObjectId(userId),
        chatRoomId: new Types.ObjectId(chatRoomId),
      });

      return doc ? UserChatMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding user chat by userId & chatRoomId", {
        userId,
        chatRoomId,
        error,
      });
      throw error;
    }
  }

  async findPaginatedByUserId(
    userId: string,
    options: IUserChatPaginationOptions,
  ): Promise<PaginatedResult<UserChat>> {
    try {
      const { page, limit, sortOrder } = options;

      const query: FilterQuery<IUserChatDocument> = {
        userId: new Types.ObjectId(userId),
      };

      const sortValue: Record<string, SortOrder> = {
        lastMessageAt: sortOrder === "asc" ? 1 : -1,
      };

      const total = await UserChatModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await UserChatModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(UserChatMapper.toDomain);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      Logger.error("Error finding paginated user chats", {
        userId,
        options,
        error,
      });
      throw error;
    }
  }
}
