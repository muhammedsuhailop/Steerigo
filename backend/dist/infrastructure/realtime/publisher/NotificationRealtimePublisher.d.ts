import { NotificationType } from "../../../domain/value-objects/NotificationType";
import { INotificationRealtimePublisher } from "../../../application/services/INotificationRealtimePublisher";
export declare class NotificationRealtimePublisher implements INotificationRealtimePublisher {
    emitToUser(userId: string, notificationId: string, type: NotificationType, title: string, body: string, metadata: Record<string, unknown>): void;
}
//# sourceMappingURL=NotificationRealtimePublisher.d.ts.map