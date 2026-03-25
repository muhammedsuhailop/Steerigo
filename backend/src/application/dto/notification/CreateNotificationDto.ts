import { z } from "zod";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

const createNotificationSchema = z.object({
  recipientId: z.string().min(1, "Recipient ID is required"),
  type: z.nativeEnum(NotificationType),
  channel: z.nativeEnum(NotificationChannel),
  title: z.string().min(1).max(255),
  body: z.string().min(1).max(1000),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

type CreateNotificationData = z.infer<typeof createNotificationSchema>;

export class CreateNotificationDto {
  private readonly data: CreateNotificationData;

  constructor(input: unknown) {
    this.data = createNotificationSchema.parse(input);
  }

  static fromPayload(input: unknown): CreateNotificationDto {
    return new CreateNotificationDto(input);
  }

  getRecipientId(): string {
    return this.data.recipientId;
  }
  getType(): NotificationType {
    return this.data.type;
  }
  getChannel(): NotificationChannel {
    return this.data.channel;
  }
  getTitle(): string {
    return this.data.title;
  }
  getBody(): string {
    return this.data.body;
  }
  getMetadata(): Record<string, unknown> {
    return this.data.metadata;
  }
}

export { createNotificationSchema };
