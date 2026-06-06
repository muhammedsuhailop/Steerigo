import { z } from "zod";
declare const getUserRideByIdSchema: z.ZodObject<{
    rideId: z.ZodString;
}, z.core.$strip>;
export declare class GetUserRideByIdDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, rideData: unknown);
    static fromRequest(userId: string, rideData: unknown): GetUserRideByIdDto;
    getUserId(): string;
    getRideId(): string;
}
export { getUserRideByIdSchema };
//# sourceMappingURL=GetUserRideByIdDto.d.ts.map