import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";

export type MessageStatusCreateParams = {
  id: string;
  messageId: string;
  userId: string;
};

export type MessageStatusData = {
  id: string;
  messageId: string;
  userId: string;
  status: MessageDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class MessageStatus {
  private constructor(
    private readonly id: string,
    private readonly messageId: string,
    private readonly userId: string,

    private status: MessageDeliveryStatus,

    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(params: MessageStatusCreateParams): MessageStatus {
    if (!params.id || !params.messageId || !params.userId) {
      throw new Error("Invalid MessageStatus creation parameters");
    }

    return new MessageStatus(
      params.id,
      params.messageId,
      params.userId,
      MessageDeliveryStatus.SENT,
    );
  }

  static fromData(data: MessageStatusData): MessageStatus {
    return new MessageStatus(
      data.id,
      data.messageId,
      data.userId,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  markDelivered(): void {
    if (this.status === MessageDeliveryStatus.READ) return;

    this.status = MessageDeliveryStatus.DELIVERED;
    this.updatedAt = new Date();
  }

  markRead(): void {
    if (this.status === MessageDeliveryStatus.READ) return;

    this.status = MessageDeliveryStatus.READ;
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getMessageId(): string {
    return this.messageId;
  }

  getUserId(): string {
    return this.userId;
  }

  getStatus(): MessageDeliveryStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
