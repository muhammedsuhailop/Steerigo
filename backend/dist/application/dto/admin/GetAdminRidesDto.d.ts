import { z } from "zod";
import { RideStatus } from "@domain/value-objects/RideStatus";
declare const getAdminRidesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        fare: "fare";
        updatedAt: "updatedAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<typeof RideStatus>>;
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    riderId: z.ZodOptional<z.ZodString>;
    driverId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class GetAdminRidesDto {
    private readonly data;
    constructor(queryData: unknown);
    static fromRequest(query: unknown): GetAdminRidesDto;
    getPage(): number;
    getLimit(): number;
    getSortBy(): string;
    getSortOrder(): "asc" | "desc";
    getStatus(): RideStatus | undefined;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
    getRiderId(): string | undefined;
    getDriverId(): string | undefined;
}
export { getAdminRidesSchema };
//# sourceMappingURL=GetAdminRidesDto.d.ts.map