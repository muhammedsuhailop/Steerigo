import { z } from "zod";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
export declare const getAdminWalletSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        type: z.ZodOptional<z.ZodEnum<typeof TransactionType>>;
        direction: z.ZodOptional<z.ZodEnum<typeof TransactionDirection>>;
        fromDate: z.ZodOptional<z.ZodString>;
        toDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=adminWalletValidators.d.ts.map