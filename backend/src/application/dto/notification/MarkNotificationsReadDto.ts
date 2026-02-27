import { z } from "zod";

const markNotificationsReadSchema = z.object({
  notificationId: z.string().optional(),
  markAll: z.boolean().optional().default(false),
});

type MarkNotificationsReadData = z.infer<typeof markNotificationsReadSchema>;

export class MarkNotificationsReadDto {
  private readonly userId: string;
  private readonly data: MarkNotificationsReadData;

  constructor(userId: string, body: unknown) {
    this.userId = userId;
    this.data = markNotificationsReadSchema.parse(body);
  }

  static fromRequest(userId: string, body: unknown): MarkNotificationsReadDto {
    return new MarkNotificationsReadDto(userId, body);
  }

  getUserId(): string {
    return this.userId;
  }
  getNotificationId(): string | undefined {
    return this.data.notificationId;
  }
  isMarkAll(): boolean {
    return this.data.markAll;
  }
}

export { markNotificationsReadSchema };
