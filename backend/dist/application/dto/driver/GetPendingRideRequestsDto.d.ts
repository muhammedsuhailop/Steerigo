import { z } from "zod";
declare const getPendingRideRequestsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare class GetPendingRideRequestsDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, queryData: unknown);
    static fromRequest(userId: string, query: unknown): GetPendingRideRequestsDto;
    getUserId(): string;
    getLimit(): number;
    getOffset(): number;
}
export { getPendingRideRequestsSchema };
//# sourceMappingURL=GetPendingRideRequestsDto.d.ts.map