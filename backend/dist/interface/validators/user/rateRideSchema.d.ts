import { z } from "zod";
export declare const rateRideSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        criteria: z.ZodObject<{
            [x: string]: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        }, z.core.$strip>;
        review: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=rateRideSchema.d.ts.map