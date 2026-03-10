import { z } from "zod";
import { RideStatus } from "@domain/value-objects/RideStatus";

const validRideStatuses = Object.values(RideStatus) as [string, ...string[]];

export const getUserRidesSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || (val > 0 && !isNaN(val)), {
        message: "Page must be a positive integer",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine(
        (val) => val === undefined || (val > 0 && val <= 100 && !isNaN(val)),
        { message: "Limit must be between 1 and 100" },
      ),
    sortBy: z.enum(["createdAt", "updatedAt", "fare"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    status: z.enum(validRideStatuses).optional(),
    fromDate: z
      .string()
      .optional()
      .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
        message: "fromDate must be a valid ISO date string",
      }),
    toDate: z
      .string()
      .optional()
      .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
        message: "toDate must be a valid ISO date string",
      }),
  }),
});
