import { z } from "zod";

const VALID_GEAR_TYPES = ["Manual", "Automatic"] as const;
const VALID_BODY_TYPES = ["Sedan", "SUV", "Hatchback"] as const;

// Location schema
export const locationSchema = z.object({
  latitude: z
    .number()
    .min(-90, { message: "Latitude must be between -90 and 90" })
    .max(90, { message: "Latitude must be between -90 and 90" }),
  longitude: z
    .number()
    .min(-180, { message: "Longitude must be between -180 and 180" })
    .max(180, { message: "Longitude must be between -180 and 180" }),
  address: z
    .string()
    .max(500, {
      message: "Address must be a string with maximum 500 characters",
    })
    .optional(),
});

export const findNearbyDriversSearchSchema = z.object({
  body: z
    .object({
      latitude: z
        .number()
        .min(-90, { message: "Latitude must be between -90 and 90" })
        .max(90, { message: "Latitude must be between -90 and 90" }),

      longitude: z
        .number()
        .min(-180, { message: "Longitude must be between -180 and 180" })
        .max(180, { message: "Longitude must be between -180 and 180" }),

      searchDate: z
        .string()
        .refine(
          (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
          },
          { message: "Search date must be a valid ISO8601 datetime" }
        )
        .refine(
          (val) => {
            const date = new Date(val);
            // Allow 5 minutes tolerance for clock skew
            return date >= new Date(Date.now() - 5 * 60 * 1000);
          },
          {
            message:
              "Search date cannot be in the past (allow 5 minutes tolerance)",
          }
        ),

      timeRequired: z
        .number()
        .int({ message: "Time required must be an integer" })
        .min(1, { message: "Time required must be at least 1 minute" })
        .max(480, {
          message: "Time required cannot exceed 480 minutes (8 hours)",
        }),

      radiusKm: z
        .number()
        .min(0.1, { message: "Radius must be at least 0.1 km" })
        .max(50, { message: "Radius cannot exceed 50 km" })
        .optional()
        .default(10),

      gearType: z.union([z.enum(VALID_GEAR_TYPES), z.literal("")]),

      bodyType: z.union([z.enum(VALID_BODY_TYPES), z.literal("")]),

      limit: z
        .number()
        .int({ message: "Limit must be an integer" })
        .min(1, { message: "Limit must be at least 1" })
        .max(100, { message: "Limit cannot exceed 100" })
        .optional()
        .default(20),
    })
    .strict(),
});

export type FindNearbyDriversSearchInput = z.infer<
  typeof findNearbyDriversSearchSchema
>;
