import { z } from "zod";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

export const getFutureRideRequestsSchema = z.object({
  query: z
    .object({
      status: z
        .nativeEnum(FutureRideRequestStatus, {
          message: `status must be one of: ${Object.values(
            FutureRideRequestStatus,
          ).join(", ")}`,
        })
        .optional(),

      page: z.coerce
        .number({
          message: "page must be a number",
        })
        .int({ message: "page must be an integer" })
        .positive({ message: "page must be a positive number" })
        .optional()
        .default(1),

      limit: z.coerce
        .number({
          message: "limit must be a number",
        })
        .int({ message: "limit must be an integer" })
        .positive({ message: "limit must be a positive number" })
        .max(100, {
          message: "limit cannot exceed 100",
        })
        .optional()
        .default(10),
    })
    .strict(),
});

export type GetFutureRideRequestsInput = z.infer<
  typeof getFutureRideRequestsSchema
>;
