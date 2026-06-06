import { z } from "zod";
export declare const chatRoomMessagesQuerySchema: z.ZodObject<{
    params: z.ZodObject<{
        chatRoomId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=chatRoomMessagesQuerySchema.d.ts.map