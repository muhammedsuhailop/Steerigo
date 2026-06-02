import { NotificationType } from "@domain/value-objects/NotificationType";
export interface INotificationRealtimePublisher {
    emitToUser(userId: string, notificationId: string, type: NotificationType, title: string, body: string, metadata: Record<string, unknown>): void;
}
//# sourceMappingURL=INotificationRealtimePublisher.d.ts.map