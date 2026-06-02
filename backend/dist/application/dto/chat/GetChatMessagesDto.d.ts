import { z } from "zod";
declare const getChatMessagesSchema: z.ZodObject<{
    chatRoomId: z.ZodString;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare class GetChatMessagesDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestData: unknown): GetChatMessagesDto;
    getUserId(): string;
    getChatRoomId(): string;
    getPage(): number;
    getLimit(): number;
    getSortOrder(): "asc" | "desc";
}
export { getChatMessagesSchema };
//# sourceMappingURL=GetChatMessagesDto.d.ts.map