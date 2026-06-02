import { AvailabilityExceptionType } from "../../../domain/value-objects/AvailabilityExceptionType";
import { AvailabilityStatus } from "../../../domain/value-objects/AvailabilityStatus";
import { RecurringPattern } from "../../../domain/value-objects/RecurringPattern";
import { z } from "zod";
export declare const scheduleRecurringAvailabilitySchema: z.ZodObject<{
    body: z.ZodObject<{
        daysOfWeek: z.ZodArray<z.ZodNumber>;
        timeSlots: z.ZodArray<z.ZodObject<{
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
        }, z.core.$strip>>;
        excludedTimeSlots: z.ZodOptional<z.ZodArray<z.ZodObject<{
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
        }, z.core.$strip>>>;
        validityStartDate: z.ZodString;
        validityEndDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        currentLocation: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const addAvailabilityExceptionSchema: z.ZodObject<{
    body: z.ZodObject<{
        type: z.ZodEnum<typeof AvailabilityExceptionType>;
        reason: z.ZodOptional<z.ZodString>;
        startTime: z.ZodString;
        endTime: z.ZodString;
        isRecurring: z.ZodOptional<z.ZodBoolean>;
        recurringPattern: z.ZodOptional<z.ZodEnum<typeof RecurringPattern>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        driverId: z.ZodString;
        status: z.ZodEnum<typeof AvailabilityStatus>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateLocationSchema: z.ZodObject<{
    body: z.ZodObject<{
        driverId: z.ZodString;
        currentLocation: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=DriverAvailabilityValidators.d.ts.map