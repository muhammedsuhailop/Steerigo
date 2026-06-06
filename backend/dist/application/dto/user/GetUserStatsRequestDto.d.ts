import { z } from "zod";
export declare const getUserStatsSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    toDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare class GetUserStatsRequestDto {
    private readonly userId;
    private readonly fromDate?;
    private readonly toDate?;
    private constructor();
    static fromRequest(userId: string, query: Record<string, unknown>): GetUserStatsRequestDto;
    getUserId(): string;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
//# sourceMappingURL=GetUserStatsRequestDto.d.ts.map