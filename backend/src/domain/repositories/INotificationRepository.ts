import { PaginatedResult } from "@shared/types/Repository";
import { Notification } from "@domain/entities/Notification";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

export interface INotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
  channel?: NotificationChannel;
  fromDate?: Date;
  toDate?: Date;
}

export interface INotificationPaginationOptions extends INotificationFilters {
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
}

export interface INotificationRepository {
  save(notification: Notification): Promise<Notification>;

  findById(id: string): Promise<Notification | null>;

  findByRecipientId(
    recipientId: string,
    options: INotificationPaginationOptions,
  ): Promise<PaginatedResult<Notification>>;

  markOneAsRead(id: string, recipientId: string): Promise<Notification | null>;

  markAllAsRead(recipientId: string): Promise<number>;

  countUnread(recipientId: string): Promise<number>;

  deleteById(id: string): Promise<void>;
}
