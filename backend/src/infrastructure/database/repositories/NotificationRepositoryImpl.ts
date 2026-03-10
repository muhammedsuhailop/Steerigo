import { injectable } from "inversify";
import { FilterQuery, SortOrder, Types } from "mongoose";
import {
  INotificationRepository,
  INotificationPaginationOptions,
} from "@domain/repositories/INotificationRepository";
import { Notification } from "@domain/entities/Notification";
import {
  NotificationModel,
  INotificationDocument,
} from "@infrastructure/database/models/NotificationModel";
import { NotificationMapper } from "@infrastructure/database/mappers/NotificationMapper";
import { Logger } from "@shared/utils/Logger";
import { PaginatedResult } from "@shared/types/Repository";

@injectable()
export class NotificationRepositoryImpl implements INotificationRepository {
  async save(notification: Notification): Promise<Notification> {
    try {
      const data = NotificationMapper.toPersistence(notification);
      const doc = await NotificationModel.create({
        ...data,
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
      });

      Logger.info("Notification saved", {
        id: doc._id.toString(),
        recipientId: doc.recipientId.toString(),
        type: doc.type,
      });

      return NotificationMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving notification", {
        recipientId: notification.getRecipientId(),
        type: notification.getType(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Notification | null> {
    try {
      const doc = await NotificationModel.findById(id);
      return doc ? NotificationMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding notification by id", { id, error });
      throw error;
    }
  }

  async findByRecipientId(
    recipientId: string,
    options: INotificationPaginationOptions,
  ): Promise<PaginatedResult<Notification>> {
    try {
      const {
        page,
        limit,
        sortOrder,
        isRead,
        type,
        channel,
        fromDate,
        toDate,
      } = options;

      const query: FilterQuery<INotificationDocument> = {
        recipientId: new Types.ObjectId(recipientId),
      };

      if (isRead !== undefined) {
        query.isRead = isRead;
      }

      if (type) {
        query.type = type;
      }

      if (channel) {
        query.channel = channel;
      }

      if (fromDate ?? toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = fromDate;
        if (toDate) query.createdAt.$lte = toDate;
      }

      const sortValue: Record<string, SortOrder> = {
        createdAt: sortOrder === "asc" ? 1 : -1,
      };

      const total = await NotificationModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await NotificationModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      Logger.debug("Notifications fetched for recipient", {
        recipientId,
        total,
        page,
        limit,
      });

      return {
        data: docs.map(NotificationMapper.toDomain),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      Logger.error("Error finding notifications by recipientId", {
        recipientId,
        options,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async markOneAsRead(
    id: string,
    recipientId: string,
  ): Promise<Notification | null> {
    try {
      const doc = await NotificationModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          recipientId: new Types.ObjectId(recipientId),
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { new: true },
      );

      if (!doc) {
        Logger.warn("Notification not found for markOneAsRead", {
          id,
          recipientId,
        });
        return null;
      }

      Logger.debug("Notification marked as read", { id, recipientId });
      return NotificationMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error marking notification as read", {
        id,
        recipientId,
        error,
      });
      throw error;
    }
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    try {
      const result = await NotificationModel.updateMany(
        {
          recipientId: new Types.ObjectId(recipientId),
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date(),
          },
        },
      );

      Logger.info("All notifications marked as read", {
        recipientId,
        modifiedCount: result.modifiedCount,
      });

      return result.modifiedCount;
    } catch (error) {
      Logger.error("Error marking all notifications as read", {
        recipientId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async countUnread(recipientId: string): Promise<number> {
    try {
      return await NotificationModel.countDocuments({
        recipientId: new Types.ObjectId(recipientId),
        isRead: false,
      });
    } catch (error) {
      Logger.error("Error counting unread notifications", {
        recipientId,
        error,
      });
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const result = await NotificationModel.findByIdAndDelete(id);
      if (!result) {
        Logger.warn("Notification not found for deletion", { id });
        return;
      }
      Logger.info("Notification deleted", { id });
    } catch (error) {
      Logger.error("Error deleting notification", { id, error });
      throw error;
    }
  }
}
