import { z } from "zod";
export declare const cancelRideSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        reason: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=cancelRideSchema.d.ts.map