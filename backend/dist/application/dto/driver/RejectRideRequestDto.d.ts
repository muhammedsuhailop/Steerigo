import { z } from "zod";
declare const rejectRideRequestSchema: z.ZodObject<{
    requestId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class RejectRideRequestDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestBody: unknown): RejectRideRequestDto;
    getUserId(): string;
    getRequestId(): string;
    getReason(): string | undefined;
}
export { rejectRideRequestSchema };
//# sourceMappingURL=RejectRideRequestDto.d.ts.map