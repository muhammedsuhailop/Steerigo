import { z } from "zod";
export declare const driverCancelRideSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        reason: z.ZodString;
    }, z.core.$loose>;
}, z.core.$strip>;
//# sourceMappingURL=driverCancelRideSchema.d.ts.map