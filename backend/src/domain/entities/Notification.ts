import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

export interface NotificationMetadata {
  rideId?: string;
  requestId?: string;
  paymentId?: string;
  [key: string]: string | undefined;
}

export class Notification {
  private constructor(
    private readonly id: string,
    private readonly recipientId: string,
    private readonly type: NotificationType,
    private readonly channel: NotificationChannel,
    private readonly title: string,
    private readonly body: string,
    private readonly metadata: NotificationMetadata,
    private isRead: boolean,
    private readAt: Date | undefined,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    recipientId: string;
    type: NotificationType;
    channel: NotificationChannel;
    title: string;
    body: string;
    metadata?: NotificationMetadata;
  }): Notification {
    if (!data.id || !data.recipientId) {
      throw new Error("Notification id and recipientId are required");
    }
    if (!data.title.trim() || !data.body.trim()) {
      throw new Error("Notification title and body are required");
    }

    return new Notification(
      data.id,
      data.recipientId,
      data.type,
      data.channel,
      data.title.trim(),
      data.body.trim(),
      data.metadata ?? {},
      false,
      undefined,
      new Date(),
      new Date(),
    );
  }

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
  }): Notification {
    return new Notification(
      data.id,
      data.recipientId,
      data.type,
      data.channel,
      data.title,
      data.body,
      data.metadata,
      data.isRead,
      data.readAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getRecipientId(): string {
    return this.recipientId;
  }
  getType(): NotificationType {
    return this.type;
  }
  getChannel(): NotificationChannel {
    return this.channel;
  }
  getTitle(): string {
    return this.title;
  }
  getBody(): string {
    return this.body;
  }
  getMetadata(): NotificationMetadata {
    return { ...this.metadata };
  }
  getIsRead(): boolean {
    return this.isRead;
  }
  getReadAt(): Date | undefined {
    return this.readAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  markAsRead(): void {
    if (this.isRead) return;
    this.isRead = true;
    this.readAt = new Date();
    this.updatedAt = new Date();
  }

  isUnread(): boolean {
    return !this.isRead;
  }
}
