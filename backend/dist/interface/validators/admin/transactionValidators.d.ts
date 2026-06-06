import { z } from "zod";
export declare const getAdminTransactionsSchema: z.ZodObject<{
    query: z.ZodObject<{
        walletId: z.ZodOptional<z.ZodString>;
        ownerId: z.ZodOptional<z.ZodString>;
        ownerType: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        direction: z.ZodOptional<z.ZodString>;
        relatedEntityId: z.ZodOptional<z.ZodString>;
        relatedEntityType: z.ZodOptional<z.ZodString>;
        fromDate: z.ZodOptional<z.ZodString>;
        toDate: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodEnum<{
            createdAt: "createdAt";
            amount: "amount";
        }>>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=transactionValidators.d.ts.map