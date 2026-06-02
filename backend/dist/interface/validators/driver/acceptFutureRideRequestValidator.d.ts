import { z } from "zod";
export declare const acceptFutureRideRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        requestId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export type AcceptFutureRideRequestInput = z.infer<typeof acceptFutureRideRequestSchema>;
//# sourceMappingURL=acceptFutureRideRequestValidator.d.ts.map