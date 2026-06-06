import { z } from "zod";
export declare const getUserRidesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
        sortBy: z.ZodOptional<z.ZodEnum<{
            createdAt: "createdAt";
            fare: "fare";
            updatedAt: "updatedAt";
        }>>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        status: z.ZodOptional<z.ZodEnum<{
            [x: string]: string;
        }>>;
        fromDate: z.ZodOptional<z.ZodString>;
        toDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=getUserRidesSchema.d.ts.map