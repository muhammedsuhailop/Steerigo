import { z } from "zod";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

export const getNotificationsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    isRead: z.enum(["true", "false"]).optional(),
    type: z.nativeEnum(NotificationType).optional(),
    channel: z.nativeEnum(NotificationChannel).optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
  }),
});
