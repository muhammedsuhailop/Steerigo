import { z } from "zod";
import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
export declare const editAvailabilityExceptionSchema: z.ZodObject<{
    params: z.ZodObject<{
        exceptionId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<typeof AvailabilityExceptionType>>;
        reason: z.ZodOptional<z.ZodString>;
        startTime: z.ZodOptional<z.ZodString>;
        endTime: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const removeAvailabilityExceptionSchema: z.ZodObject<{
    params: z.ZodObject<{
        exceptionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=EditAvailabilityExceptionValidators.d.ts.map