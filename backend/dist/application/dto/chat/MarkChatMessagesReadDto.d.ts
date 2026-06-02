import { z } from "zod";
declare const markChatMessagesReadSchema: z.ZodObject<{
    chatRoomId: z.ZodString;
    messageId: z.ZodString;
}, z.core.$strip>;
export declare class MarkChatMessagesReadDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromSocketPayload(userId: string, requestData: unknown): MarkChatMessagesReadDto;
    getUserId(): string;
    getChatRoomId(): string;
    getMessageId(): string;
}
export { markChatMessagesReadSchema };
//# sourceMappingURL=MarkChatMessagesReadDto.d.ts.map