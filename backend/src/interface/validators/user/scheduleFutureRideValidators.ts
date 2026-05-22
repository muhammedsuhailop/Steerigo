import { z } from "zod";
import { RideType } from "@domain/value-objects/RideType";
import {
  VALID_BODY_TYPES,
  VALID_GEAR_TYPES,
} from "@domain/value-objects/VehicleType";
import { AppConstants } from "@shared/constants/AppConstants";

export const scheduleFutureRideSchema = z.object({
  body: z
    .object({
      requestGroupId: z
        .string()
        .min(1, { message: "requestGroupId is required" })
        .regex(/^[0-9a-fA-F]{24}$/, {
          message:
            "requestGroupId must be a 24-character hex string (MongoDB ObjectId)",
        }),
      latitude: z
        .number()
        .min(-90, { message: "Latitude must be between -90 and 90" })
        .max(90, { message: "Latitude must be between -90 and 90" }),
      longitude: z
        .number()
        .min(-180, { message: "Longitude must be between -180 and 180" })
        .max(180, { message: "Longitude must be between -180 and 180" }),
      pickupTime: z
        .string()
        .refine(
          (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
          },
          { message: "pickupTime must be a valid ISO8601 datetime" },
        )
        .refine(
          (val) => {
            const date = new Date(val);
            const minAllowed = new Date(
              Date.now() +
                AppConstants.FUTURE_RIDE_MIN_HOURS_AHEAD * 60 * 60 * 1000,
            );
            return date >= minAllowed;
          },
          {
            message: `Pickup time must be at least ${AppConstants.FUTURE_RIDE_MIN_HOURS_AHEAD} hours from now`,
          },
        ),
      radiusKm: z
        .number()
        .min(0.1, { message: "Radius must be at least 0.1 km" })
        .max(50, { message: "Radius cannot exceed 50 km" })
        .optional()
        .default(AppConstants.FUTURE_RIDE_DEFAULT_RADIUS_KM),
      gearType: z.union([z.enum(VALID_GEAR_TYPES), z.literal("")]).optional(),
      bodyType: z.union([z.enum(VALID_BODY_TYPES), z.literal("")]).optional(),
      maxCandidates: z
        .number()
        .int({ message: "maxCandidates must be an integer" })
        .min(1, { message: "maxCandidates must be at least 1" })
        .max(20, { message: "maxCandidates cannot exceed 20" })
        .optional()
        .default(AppConstants.FUTURE_RIDE_MAX_CANDIDATES),
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
        .max(500, { message: "Drop address cannot exceed 500 characters" })
        .optional(),
      pickupAddress: z
        .string()
        .max(500, { message: "Pickup address cannot exceed 500 characters" })
        .optional(),
      rideType: z.enum(RideType, {
        message: "Ride type must be either 'One Way' or 'Round Trip'",
      }),
      requiredDuration: z.number().min(1),
    })
    .strict(),
});

export const cancelFutureRideSchema = z.object({
  body: z
    .object({
      requestGroupId: z
        .string()
        .min(1, { message: "requestGroupId is required" })
        .regex(/^[0-9a-fA-F]{24}$/, {
          message:
            "requestGroupId must be a 24-character hex string (MongoDB ObjectId)",
        }),
    })
    .strict(),
});

export type ScheduleFutureRideInput = z.infer<typeof scheduleFutureRideSchema>;
export type CancelFutureRideInput = z.infer<typeof cancelFutureRideSchema>;
