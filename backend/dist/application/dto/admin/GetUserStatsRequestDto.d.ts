import { z } from "zod";
export declare const getUserStatsSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare class GetUserStatsRequestDto {
    private readonly fromDate?;
    private readonly toDate?;
    private constructor();
    static fromRequest(query: Record<string, unknown>): GetUserStatsRequestDto;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
//# sourceMappingURL=GetUserStatsRequestDto.d.ts.map