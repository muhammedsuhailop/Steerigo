import { injectable } from "inversify";
import { NotificationSocketAdapter } from "@infrastructure/adapters/NotificationSocketAdapter";
import { NotificationSocketPayload } from "@application/dto/notification/NotificationSocketPayload";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { Logger } from "@shared/utils/Logger";
import { INotificationRealtimePublisher } from "@application/services/INotificationRealtimePublisher";

@injectable()
export class NotificationRealtimePublisher
  implements INotificationRealtimePublisher
{
  emitToUser(
    userId: string,
    notificationId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata: Record<string, unknown>,
  ): void {
    try {
      const payload: NotificationSocketPayload = {
        notificationId,
        type,
        title,
        body,
        metadata,
        createdAt: new Date().toISOString(),
      };

      NotificationSocketAdapter.emitToUser(userId, payload);

      Logger.debug("Realtime notification emitted", {
        userId,
        notificationId,
        type,
      });
    } catch (error) {
      Logger.error("NotificationRealtimePublisher emit failed", {
        userId,
        notificationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
