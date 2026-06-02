import { z } from "zod";
import { NotificationType } from "../../../domain/value-objects/NotificationType";
import { NotificationChannel } from "../../../domain/value-objects/NotificationChannel";
export declare const getNotificationsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        isRead: z.ZodOptional<z.ZodEnum<{
            true: "true";
            false: "false";
        }>>;
        type: z.ZodOptional<z.ZodEnum<typeof NotificationType>>;
        channel: z.ZodOptional<z.ZodEnum<typeof NotificationChannel>>;
        fromDate: z.ZodOptional<z.ZodString>;
        toDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=getNotificationsSchema.d.ts.map