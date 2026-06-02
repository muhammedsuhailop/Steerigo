import { z } from "zod";
export declare const editChatMessageRouteSchema: z.ZodObject<{
    params: z.ZodObject<{
        messageId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=editChatMessageRouteSchema.d.ts.map