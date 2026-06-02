import { z } from "zod";
import { RideStatus } from "@domain/value-objects/RideStatus";
declare const getUserRidesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        fare: "fare";
        updatedAt: "updatedAt";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    status: z.ZodOptional<z.ZodEnum<typeof RideStatus>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class GetUserRidesDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, queryData: unknown);
    static fromRequest(userId: string, query: unknown): GetUserRidesDto;
    getUserId(): string;
    getPage(): number;
    getLimit(): number;
    getSortBy(): string;
    getSortOrder(): "asc" | "desc";
    getStatus(): RideStatus | undefined;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
export { getUserRidesSchema };
//# sourceMappingURL=GetUserRidesDto.d.ts.map