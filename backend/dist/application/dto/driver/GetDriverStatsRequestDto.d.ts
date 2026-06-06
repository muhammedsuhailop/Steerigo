import { z } from "zod";
export declare const getDriverStatsSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare class GetDriverStatsRequestDto {
    private readonly userId;
    private readonly fromDate?;
    private readonly toDate?;
    private constructor();
    static fromRequest(userId: string, query: Record<string, unknown>): GetDriverStatsRequestDto;
    getUserId(): string;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
//# sourceMappingURL=GetDriverStatsRequestDto.d.ts.map