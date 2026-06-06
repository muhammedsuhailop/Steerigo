import { z } from "zod";
export declare const rideIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RideIdParamRequest = z.infer<typeof rideIdParamSchema>;
//# sourceMappingURL=rideIdParamSchema.d.ts.map