import { z } from "zod";
export declare const applyCouponSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        couponCode: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const removeCouponSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=couponSchema.d.ts.map