import { z } from "zod";
export declare const getAdminDriverStatsSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare class GetAdminDriverStatsRequestDto {
    private readonly fromDate?;
    private readonly toDate?;
    private constructor();
    static fromRequest(query: Record<string, unknown>): GetAdminDriverStatsRequestDto;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
//# sourceMappingURL=GetAdminDriverStatsRequestDto.d.ts.map