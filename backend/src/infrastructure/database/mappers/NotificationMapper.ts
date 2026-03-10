import { Notification } from "@domain/entities/Notification";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
import { INotificationDocument } from "@infrastructure/database/models/NotificationModel";
import { toObjectId } from "@shared/utils/idHelper";
import { Document } from "mongoose";

export class NotificationMapper {
  static toDomain(doc: INotificationDocument): Notification {
    return Notification.fromData({
      id: doc._id.toString(),
      recipientId: doc.recipientId.toString(),
      type: doc.type as NotificationType,
      channel: doc.channel as NotificationChannel,
      title: doc.title,
      body: doc.body,
      metadata: doc.metadata ?? {},
      isRead: doc.isRead,
      readAt: doc.readAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(
    notification: Notification,
  ): Omit<INotificationDocument, keyof Document> {
    return {
      recipientId: toObjectId(notification.getRecipientId()),
      type: notification.getType(),
      channel: notification.getChannel(),
      title: notification.getTitle(),
      body: notification.getBody(),
      metadata: notification.getMetadata(),
      isRead: notification.getIsRead(),
      readAt: notification.getReadAt(),
      createdAt: notification.getCreatedAt(),
      updatedAt: notification.getUpdatedAt(),
    } as Omit<INotificationDocument, keyof Document>;
  }
}
