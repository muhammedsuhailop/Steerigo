import { z } from "zod";

const VALID_RIDE_TYPES = ["One Way", "Round Trip"] as const;

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

// Send Ride Request Schema
export const sendRideRequestSchema = z.object({
  body: z
    .object({
      driverId: z
        .string()
        .min(1, { message: "Driver ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, {
          message: "Driver ID must be a valid MongoDB ObjectId",
        }),
      pickup: locationSchema,
      drop: locationSchema,
      pickupTime: z
        .string()
        .refine(
          (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
          },
          { message: "Pickup time must be a valid ISO8601 datetime" }
        )
        .refine(
          (val) => {
            const date = new Date(val);
            // Allow 5 minutes tolerance for clock skew
            return date >= new Date(Date.now() - 5 * 60 * 1000);
          },
          {
            message:
              "Pickup time cannot be in the past (allow 5 minutes tolerance)",
          }
        ),
      rideType: z.enum(VALID_RIDE_TYPES, {
        message: "Ride type must be either 'One Way' or 'Round Trip'",
      }),
      fare: z
        .number()
        .positive({ message: "Fare must be a positive number" })
        .min(0.01, { message: "Fare must be at least 0.01" })
        .max(999999, { message: "Fare cannot exceed 999999" }),
      pickupETA: z
        .string()
        .min(1, { message: "Pickup ETA is required" })
        .max(50, { message: "Pickup ETA must not exceed 50 characters" }),
    })
    .strict(),
});

export type SendRideRequestInput = z.infer<typeof sendRideRequestSchema>;
