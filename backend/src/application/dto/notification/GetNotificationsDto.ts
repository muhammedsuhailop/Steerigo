import { z } from "zod";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

const getNotificationsSchema = z.object({
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().max(100).optional().default(20),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  isRead: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true";
    })
    .optional(),
  type: z.nativeEnum(NotificationType).optional(),
  channel: z.nativeEnum(NotificationChannel).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

type GetNotificationsData = z.infer<typeof getNotificationsSchema>;

export class GetNotificationsDto {
  private readonly userId: string;
  private readonly data: GetNotificationsData;

  constructor(userId: string, query: unknown) {
    this.userId = userId;
    this.data = getNotificationsSchema.parse(query);
  }

  static fromRequest(userId: string, query: unknown): GetNotificationsDto {
    return new GetNotificationsDto(userId, query);
  }

  getUserId(): string {
    return this.userId;
  }
  getPage(): number {
    return this.data.page;
  }
  getLimit(): number {
    return this.data.limit;
  }
  getSortOrder(): "asc" | "desc" {
    return this.data.sortOrder;
  }
  getIsRead(): boolean | undefined {
    return this.data.isRead;
  }
  getType(): NotificationType | undefined {
    return this.data.type;
  }
  getChannel(): NotificationChannel | undefined {
    return this.data.channel;
  }
  getFromDate(): Date | undefined {
    return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
  }
  getToDate(): Date | undefined {
    return this.data.toDate ? new Date(this.data.toDate) : undefined;
  }
}

export { getNotificationsSchema };
