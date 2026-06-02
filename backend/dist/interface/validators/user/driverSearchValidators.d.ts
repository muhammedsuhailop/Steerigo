import { z } from "zod";
export declare const locationSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const findNearbyDriversSearchSchema: z.ZodObject<{
    body: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        searchDate: z.ZodString;
        timeRequired: z.ZodNumber;
        radiusKm: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        gearType: z.ZodUnion<readonly [z.ZodEnum<{
            Manual: "Manual";
            Automatic: "Automatic";
        }>, z.ZodLiteral<"">]>;
        bodyType: z.ZodUnion<readonly [z.ZodEnum<{
            Sedan: "Sedan";
            SUV: "SUV";
            Hatchback: "Hatchback";
        }>, z.ZodLiteral<"">]>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type FindNearbyDriversSearchInput = z.infer<typeof findNearbyDriversSearchSchema>;
//# sourceMappingURL=driverSearchValidators.d.ts.map