import { z } from "zod";
import { ReviewType } from "@domain/value-objects/ReviewType";
export declare const getAdminRatingsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        overallRating: "overallRating";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    reviewType: z.ZodOptional<z.ZodEnum<typeof ReviewType>>;
    reviewerId: z.ZodOptional<z.ZodString>;
    revieweeId: z.ZodOptional<z.ZodString>;
    rideId: z.ZodOptional<z.ZodString>;
    minRating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxRating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare class GetAdminRatingsDto {
    private readonly data;
    constructor(queryData: unknown);
    static fromRequest(query: unknown): GetAdminRatingsDto;
    getPage(): number;
    getLimit(): number;
    getSortBy(): "createdAt" | "overallRating";
    getSortOrder(): "asc" | "desc";
    getReviewType(): ReviewType | undefined;
    getReviewerId(): string | undefined;
    getRevieweeId(): string | undefined;
    getRideId(): string | undefined;
    getMinRating(): number | undefined;
    getMaxRating(): number | undefined;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
//# sourceMappingURL=GetAdminRatingsDto.d.ts.map