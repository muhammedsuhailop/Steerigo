import { z } from "zod";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
declare const getFutureRideRequestsDtoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<typeof FutureRideRequestStatus>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export declare class GetFutureRideRequestsDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, queryData: unknown);
    static fromRequest(userId: string, query: unknown): GetFutureRideRequestsDto;
    getUserId(): string;
    getStatus(): FutureRideRequestStatus | undefined;
    getPage(): number;
    getLimit(): number;
    getOffset(): number;
}
export { getFutureRideRequestsDtoSchema };
//# sourceMappingURL=GetFutureRideRequestsDto.d.ts.map