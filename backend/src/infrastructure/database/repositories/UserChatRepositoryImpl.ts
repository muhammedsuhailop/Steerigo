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

  async getTotalUnreadCountByUserId(userId: string): Promise<number> {
    try {
      const result = await UserChatModel.aggregate<{
        totalUnreadCount: number;
      }>([
        {
          $match: {
            userId: new Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            totalUnreadCount: { $sum: "$unreadCount" },
          },
        },
      ]);

      return result[0]?.totalUnreadCount ?? 0;
    } catch (error) {
      Logger.error("Error getting total unread count by userId", {
        userId,
        error,
      });
      throw error;
    }
  }

  async markChatAsRead(
    userId: string,
    chatRoomId: string,
    lastReadMessageId: string,
    readAt: Date,
  ): Promise<UserChat | null> {
    try {
      const existingDoc = await UserChatModel.findOne({
        userId: new Types.ObjectId(userId),
        chatRoomId: new Types.ObjectId(chatRoomId),
      });

      if (!existingDoc) {
        Logger.warn("UserChat not found while marking chat as read", {
          userId,
          chatRoomId,
          lastReadMessageId,
        });
        return null;
      }

      const userChat = UserChatMapper.toDomain(existingDoc);

      userChat.markAsRead(lastReadMessageId);

      const persistenceData = UserChatMapper.toPersistence(userChat);

      const updatedDoc = await UserChatModel.findByIdAndUpdate(
        existingDoc._id,
        {
          ...persistenceData,
          updatedAt: readAt,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedDoc) {
        Logger.warn("Failed to update UserChat while marking as read", {
          userId,
          chatRoomId,
          lastReadMessageId,
        });
        return null;
      }

      return UserChatMapper.toDomain(updatedDoc);
    } catch (error) {
      Logger.error("Error marking chat as read", {
        userId,
        chatRoomId,
        lastReadMessageId,
        error,
      });
      throw error;
    }
  }
}
