import { z } from "zod";
export declare const sendChatMessageRouteSchema: z.ZodObject<{
    params: z.ZodObject<{
        chatRoomId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=sendChatMessageSchema.d.ts.map