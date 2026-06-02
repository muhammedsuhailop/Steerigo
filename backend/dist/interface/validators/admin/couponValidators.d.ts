import { z } from "zod";
export declare const createCouponSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
        discountType: z.ZodString;
        discountValue: z.ZodNumber;
        maxDiscount: z.ZodOptional<z.ZodNumber>;
        minRideAmount: z.ZodOptional<z.ZodNumber>;
        usageLimit: z.ZodOptional<z.ZodNumber>;
        usagePerUser: z.ZodOptional<z.ZodNumber>;
        validFrom: z.ZodOptional<z.ZodString>;
        validTo: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const editCouponSchema: z.ZodObject<{
    params: z.ZodObject<{
        couponId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        discountType: z.ZodOptional<z.ZodString>;
        discountValue: z.ZodOptional<z.ZodNumber>;
        maxDiscount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minRideAmount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        usageLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        usagePerUser: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        validFrom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        validTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getAdminCouponsSchema: z.ZodObject<{
    query: z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        discountType: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEnum<{
            true: "true";
            false: "false";
        }>>;
        validFromStart: z.ZodOptional<z.ZodString>;
        validFromEnd: z.ZodOptional<z.ZodString>;
        validToStart: z.ZodOptional<z.ZodString>;
        validToEnd: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodEnum<{
            createdAt: "createdAt";
            code: "code";
            discountValue: "discountValue";
            validFrom: "validFrom";
            validTo: "validTo";
        }>>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=couponValidators.d.ts.map