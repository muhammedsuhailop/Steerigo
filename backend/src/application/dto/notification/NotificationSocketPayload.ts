export interface NotificationSocketPayload {
  notificationId: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
