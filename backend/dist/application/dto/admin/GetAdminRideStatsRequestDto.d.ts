import { z } from "zod";
export declare const getRideStatsSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare class GetAdminRideStatsRequestDto {
    private readonly fromDate?;
    private readonly toDate?;
    private constructor();
    static fromRequest(query: Record<string, unknown>): GetAdminRideStatsRequestDto;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
//# sourceMappingURL=GetAdminRideStatsRequestDto.d.ts.map