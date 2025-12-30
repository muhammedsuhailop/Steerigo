import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";
import { z } from "zod";

export const scheduleRecurringAvailabilitySchema = z.object({
  body: z.object({
    daysOfWeek: z
      .array(z.number().int().min(0).max(6))
      .min(1, "At least one day must be selected"),
    timeSlots: z
      .array(
        z.object({
          startTime: z.number().int().min(0).max(1440),
          endTime: z.number().int().min(0).max(1440),
        })
      )
      .min(1, "At least one time slot must be defined"),
    excludedTimeSlots: z
      .array(
        z.object({
          startTime: z.number().int().min(0).max(1440),
          endTime: z.number().int().min(0).max(1440),
        })
      )
      .optional(),
    validityStartDate: z
      .string()
      .datetime("Invalid datetime format for validityStartDate"),
    validityEndDate: z
      .string()
      .datetime("Invalid datetime format for validityEndDate")
      .optional(),
    notes: z.string().max(1000).optional(),
    currentLocation: z.object({
      latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),
      longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
      address: z
        .string()
        .max(500, "Address must not exceed 500 characters")
        .optional(),
    }),
  }),
});

export const addAvailabilityExceptionSchema = z.object({
  body: z.object({
    type: z.nativeEnum(AvailabilityExceptionType),
    reason: z.string().max(500).optional(),
    startTime: z.string().datetime("Invalid datetime format for startTime"),
    endTime: z.string().datetime("Invalid datetime format for endTime"),
    isRecurring: z.boolean().optional(),
    recurringPattern: z.nativeEnum(RecurringPattern).optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "driverId must be a valid MongoDB ID")
      .nonempty({ message: "driverId is required" }),
    status: z.nativeEnum(AvailabilityStatus, {
      message: "Status must be one of: Available, Busy, Offline, Scheduled",
    }),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "driverId must be a valid MongoDB ID")
      .nonempty({ message: "driverId is required" }),
    currentLocation: z.object({
      latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),
      longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
      address: z
        .string()
        .max(500, "Address must not exceed 500 characters")
        .optional(),
    }),
  }),
});
