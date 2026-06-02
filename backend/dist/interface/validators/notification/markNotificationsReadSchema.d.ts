import { z } from "zod";
export declare const markNotificationsReadSchema: z.ZodObject<{
    body: z.ZodObject<{
        notificationId: z.ZodOptional<z.ZodString>;
        markAll: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=markNotificationsReadSchema.d.ts.map