import { z } from "zod";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
declare const getDriverWalletSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    type: z.ZodOptional<z.ZodEnum<typeof TransactionType>>;
    direction: z.ZodOptional<z.ZodEnum<typeof TransactionDirection>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class GetDriverWalletDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, queryData: unknown);
    static fromRequest(userId: string, query: unknown): GetDriverWalletDto;
    getUserId(): string;
    getPage(): number;
    getLimit(): number;
    getSortOrder(): "asc" | "desc";
    getType(): TransactionType | undefined;
    getDirection(): TransactionDirection | undefined;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
export { getDriverWalletSchema };
//# sourceMappingURL=GetDriverWalletDto.d.ts.map