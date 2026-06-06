import { z } from "zod";
declare const sendChatMessageSchema: z.ZodObject<{
    chatRoomId: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export declare class SendChatMessageDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestData: unknown): SendChatMessageDto;
    getUserId(): string;
    getChatRoomId(): string;
    getContent(): string;
}
export { sendChatMessageSchema };
//# sourceMappingURL=SendChatMessageDto.d.ts.map