import { z } from "zod";
declare const getRideChatRoomSchema: z.ZodObject<{
    rideId: z.ZodString;
}, z.core.$strip>;
export declare class GetRideChatRoomDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestData: unknown): GetRideChatRoomDto;
    getUserId(): string;
    getRideId(): string;
}
export { getRideChatRoomSchema };
//# sourceMappingURL=GetRideChatRoomDto.d.ts.map