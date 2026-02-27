import { z } from "zod";

export const markNotificationsReadSchema = z.object({
  body: z
    .object({
      notificationId: z.string().optional(),
      markAll: z.boolean().optional(),
    })
    .refine((data) => data.markAll === true || !!data.notificationId, {
      message: "Provide either notificationId or set markAll to true",
    }),
});
