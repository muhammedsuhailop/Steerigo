import { z } from "zod";
declare const editChatMessageSchema: z.ZodObject<{
    messageId: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export declare class EditChatMessageDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestData: unknown): EditChatMessageDto;
    getUserId(): string;
    getMessageId(): string;
    getContent(): string;
}
export { editChatMessageSchema };
//# sourceMappingURL=EditChatMessageDto.d.ts.map