import { z } from "zod";

export const scheduleAvailabilitySchema = z.object({
  body: z
    .object({
      availableFrom: z
        .string()
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        }, "availableFrom must be a valid ISO8601 datetime")
        .refine((val) => {
          const date = new Date(val);
          return date >= new Date();
        }, "availableFrom cannot be in the past"),
      availableTill: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "availableTill must be a valid ISO8601 datetime"),
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
          .max(500, "Address must be a string with maximum 500 characters")
          .optional(),
      }),
    })
    .refine(
      (data) => {
        const availableFrom = new Date(data.availableFrom);
        const availableTill = new Date(data.availableTill);
        return availableTill > availableFrom;
      },
      {
        message: "availableTill must be after availableFrom",
        path: ["availableTill"],
      }
    )
    .refine(
      (data) => {
        const availableFrom = new Date(data.availableFrom);
        const availableTill = new Date(data.availableTill);
        const maxDuration = 168 * 60 * 60 * 1000; //7 days
        return availableTill.getTime() - availableFrom.getTime() <= maxDuration;
      },
      {
        message: "Availability duration cannot exceed 7 Days",
        path: ["availableTill"],
      }
    ),
});

export const updateStatusSchema = z.object({
  body: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "driverId must be a valid")
      .nonempty({ message: "driverId is required" }),
    status: z.enum(["Available", "Busy", "Offline", "Scheduled"], {
      message: "Status must be one of: Available, Busy, Offline",
    }),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "driverId must be a valid")
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
        .max(500, "Address must be a string with maximum 500 characters")
        .optional(),
    }),
  }),
});
