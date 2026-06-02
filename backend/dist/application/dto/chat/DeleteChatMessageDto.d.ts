import { z } from "zod";
declare const deleteChatMessageSchema: z.ZodObject<{
    messageId: z.ZodString;
}, z.core.$strip>;
export declare class DeleteChatMessageDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestData: unknown): DeleteChatMessageDto;
    getUserId(): string;
    getMessageId(): string;
}
export { deleteChatMessageSchema };
//# sourceMappingURL=DeleteChatMessageDto.d.ts.map