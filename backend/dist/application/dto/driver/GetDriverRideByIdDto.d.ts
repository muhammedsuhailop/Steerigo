import { z } from "zod";
declare const getDriverRideByIdSchema: z.ZodObject<{
    rideId: z.ZodString;
}, z.core.$strip>;
export declare class GetDriverRideByIdDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, rideData: unknown);
    static fromRequest(userId: string, rideData: unknown): GetDriverRideByIdDto;
    getUserId(): string;
    getRideId(): string;
}
export { getDriverRideByIdSchema };
//# sourceMappingURL=GetDriverRideByIdDto.d.ts.map