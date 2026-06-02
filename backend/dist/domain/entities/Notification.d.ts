import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
export interface NotificationMetadata {
    rideId?: string;
    requestId?: string;
    paymentId?: string;
    [key: string]: unknown;
}
export declare class Notification {
    private readonly id;
    private readonly recipientId;
    private readonly type;
    private readonly channel;
    private readonly title;
    private readonly body;
    private readonly metadata;
    private isRead;
    private readAt;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(data: {
        id: string;
        recipientId: string;
        type: NotificationType;
        channel: NotificationChannel;
        title: string;
        body: string;
        metadata?: NotificationMetadata;
    }): Notification;
    static fromData(data: {
        id: string;
        recipientId: string;
        type: NotificationType;
        channel: NotificationChannel;
        title: string;
        body: string;
        metadata: NotificationMetadata;
        isRead: boolean;
        readAt: Date | undefined;
        createdAt: Date;
        updatedAt: Date;
    }): Notification;
    getId(): string;
    getRecipientId(): string;
    getType(): NotificationType;
    getChannel(): NotificationChannel;
    getTitle(): string;
    getBody(): string;
    getMetadata(): NotificationMetadata;
    getIsRead(): boolean;
    getReadAt(): Date | undefined;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    markAsRead(): void;
    isUnread(): boolean;
}
//# sourceMappingURL=Notification.d.ts.map