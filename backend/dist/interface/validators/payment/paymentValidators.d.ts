import { z } from "zod";
import { PaymentMethod } from "../../../domain/value-objects/PaymentMethod";
export declare const initiatePaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodString;
        method: z.ZodEnum<typeof PaymentMethod>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const verifyPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        paymentId: z.ZodString;
        gatewayOrderId: z.ZodString;
        gatewayPaymentId: z.ZodString;
        gatewaySignature: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const confirmCashPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodString;
        method: z.ZodLiteral<PaymentMethod.CASH>;
        amount: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const markPaymentFailedValidatorSchema: z.ZodObject<{
    body: z.ZodObject<{
        paymentId: z.ZodString;
        reason: z.ZodDefault<z.ZodOptional<z.ZodEnum<typeof import("../../../domain/value-objects/PaymentFailureReason").PaymentFailureReason>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=paymentValidators.d.ts.map