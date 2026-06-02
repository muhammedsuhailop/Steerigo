import { z } from "zod";
export declare const rejectFutureRideRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        requestId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export type RejectFutureRideRequestInput = z.infer<typeof rejectFutureRideRequestSchema>;
//# sourceMappingURL=rejectFutureRideRequestValidator.d.ts.map