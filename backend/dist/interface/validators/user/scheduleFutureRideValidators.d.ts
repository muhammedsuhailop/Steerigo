import { z } from "zod";
import { RideType } from "@domain/value-objects/RideType";
export declare const scheduleFutureRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        requestGroupId: z.ZodString;
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        pickupTime: z.ZodString;
        radiusKm: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        gearType: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            Manual: import("@domain/value-objects/VehicleType").GearType.MANUAL;
            Automatic: import("@domain/value-objects/VehicleType").GearType.AUTOMATIC;
        }>, z.ZodLiteral<"">]>>;
        bodyType: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            Sedan: import("@domain/value-objects/VehicleType").BodyType.SEDAN;
            SUV: import("@domain/value-objects/VehicleType").BodyType.SUV;
            Hatchback: import("@domain/value-objects/VehicleType").BodyType.HATCHBACK;
        }>, z.ZodLiteral<"">]>>;
        maxCandidates: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        dropLatitude: z.ZodNumber;
        dropLongitude: z.ZodNumber;
        dropAddress: z.ZodOptional<z.ZodString>;
        pickupAddress: z.ZodOptional<z.ZodString>;
        rideType: z.ZodEnum<typeof RideType>;
        requiredDuration: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const cancelFutureRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        requestGroupId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export type ScheduleFutureRideInput = z.infer<typeof scheduleFutureRideSchema>;
export type CancelFutureRideInput = z.infer<typeof cancelFutureRideSchema>;
//# sourceMappingURL=scheduleFutureRideValidators.d.ts.map