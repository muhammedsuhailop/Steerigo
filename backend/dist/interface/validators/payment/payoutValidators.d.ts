import { z } from "zod";
import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
export declare const requestPayoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        amount: z.ZodNumber;
        method: z.ZodEnum<typeof PayoutMethod>;
        destination: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"BANK">;
            accountNumber: z.ZodString;
            ifsc: z.ZodString;
            beneficiaryName: z.ZodString;
            bankName: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"UPI">;
            upiId: z.ZodString;
            beneficiaryName: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "type">;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const approvePayoutSchema: z.ZodObject<{
    params: z.ZodObject<{
        payoutId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const rejectPayoutSchema: z.ZodObject<{
    params: z.ZodObject<{
        payoutId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        reason: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getAdminPayoutsSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<typeof PayoutStatus>>;
        driverId: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            createdAt: "createdAt";
            amount: "amount";
        }>>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=payoutValidators.d.ts.map