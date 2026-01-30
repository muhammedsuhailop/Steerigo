import { RideType } from "@domain/value-objects/RideType";
import {
  VALID_BODY_TYPES,
  VALID_GEAR_TYPES,
} from "@domain/value-objects/VehicleType";
import { z } from "zod";

const locationSchema = z.object({
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

export const autoSearchAndRequestSchema = z.object({
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
          { message: "Search date must be a valid ISO8601 datetime" },
        )
        .refine(
          (val) => {
            const date = new Date(val);
            return date >= new Date(Date.now() - 5 * 60 * 1000);
          },
          {
            message:
              "Search date cannot be in the past (allow 5 minutes tolerance)",
          },
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
      gearType: z.union([z.enum(VALID_GEAR_TYPES), z.literal("")]).optional(),
      bodyType: z.union([z.enum(VALID_BODY_TYPES), z.literal("")]).optional(),
      maxRideRequests: z
        .number()
        .int({ message: "Max ride requests must be an integer" })
        .min(1, { message: "Max ride requests must be at least 1" })
        .max(20, { message: "Max ride requests cannot exceed 20" })
        .optional()
        .default(5),
      dropLatitude: z
        .number()
        .min(-90, { message: "Drop latitude must be between -90 and 90" })
        .max(90, { message: "Drop latitude must be between -90 and 90" }),
      dropLongitude: z
        .number()
        .min(-180, { message: "Drop longitude must be between -180 and 180" })
        .max(180, { message: "Drop longitude must be between -180 and 180" }),
      dropAddress: z
        .string()
        .max(500, {
          message: "Drop address must be a string with maximum 500 characters",
        })
        .optional(),
      pickupAddress: z
        .string()
        .max(500, {
          message:
            "Pickup address must be a string with maximum 500 characters",
        })
        .optional(),
      rideType: z.enum(RideType, {
        message: "Ride type must be either 'One Way' or 'Round Trip'",
      }),
      requestGroupId: z
        .string()
        .uuid({ message: "requestGroupId must be a valid UUID" }),
    })
    .strict(),
});

export type AutoSearchAndRequestInput = z.infer<
  typeof autoSearchAndRequestSchema
>;
