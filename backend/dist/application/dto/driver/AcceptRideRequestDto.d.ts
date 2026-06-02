import { z } from "zod";
declare const acceptRideRequestSchema: z.ZodObject<{
    requestId: z.ZodString;
}, z.core.$strip>;
export declare class AcceptRideRequestDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestBody: unknown): AcceptRideRequestDto;
    getUserId(): string;
    getRequestId(): string;
}
export { acceptRideRequestSchema };
//# sourceMappingURL=AcceptRideRequestDto.d.ts.map