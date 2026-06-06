import { z } from "zod";
export declare const getUserCouponsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare class GetUserCouponsDto {
    private readonly userId;
    private readonly page;
    private readonly limit;
    private constructor();
    static fromRequest(userId: string, query: Record<string, unknown>): GetUserCouponsDto;
    getUserId(): string;
    getPage(): number;
    getLimit(): number;
}
//# sourceMappingURL=GetUserCouponsDto.d.ts.map