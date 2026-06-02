import { z } from "zod";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
export declare const getFutureRideRequestsSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<typeof FutureRideRequestStatus>>;
        page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type GetFutureRideRequestsInput = z.infer<typeof getFutureRideRequestsSchema>;
//# sourceMappingURL=getFutureRideRequestsValidator.d.ts.map