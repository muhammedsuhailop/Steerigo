import { z } from "zod";
declare const createRideChatRoomSchema: z.ZodObject<{
    rideId: z.ZodString;
}, z.core.$strip>;
export declare class CreateRideChatRoomDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestData: unknown): CreateRideChatRoomDto;
    getUserId(): string;
    getRideId(): string;
}
export { createRideChatRoomSchema };
//# sourceMappingURL=CreateRideChatRoomDto.d.ts.map