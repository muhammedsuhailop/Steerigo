import { z } from "zod";
import { RideStatus } from "../../../domain/value-objects/RideStatus";
declare const getDriverRidesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        status: "status";
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
export declare class GetDriverRidesDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, queryData: unknown);
    static fromRequest(userId: string, query: unknown): GetDriverRidesDto;
    getUserId(): string;
    getPage(): number;
    getLimit(): number;
    getSortBy(): string;
    getSortOrder(): "asc" | "desc";
    getStatus(): RideStatus | undefined;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
export { getDriverRidesSchema };
//# sourceMappingURL=GetDriverRidesDto.d.ts.map