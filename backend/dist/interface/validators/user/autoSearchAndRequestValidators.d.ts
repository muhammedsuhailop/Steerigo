import { RideType } from "@domain/value-objects/RideType";
import { z } from "zod";
export declare const autoSearchAndRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        searchDate: z.ZodString;
        timeRequired: z.ZodNumber;
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
        maxRideRequests: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        dropLatitude: z.ZodNumber;
        dropLongitude: z.ZodNumber;
        dropAddress: z.ZodOptional<z.ZodString>;
        pickupAddress: z.ZodOptional<z.ZodString>;
        rideType: z.ZodEnum<typeof RideType>;
        requestGroupId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export type AutoSearchAndRequestInput = z.infer<typeof autoSearchAndRequestSchema>;
//# sourceMappingURL=autoSearchAndRequestValidators.d.ts.map