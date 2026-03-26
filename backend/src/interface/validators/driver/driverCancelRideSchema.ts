import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";
import { z } from "zod";

export const driverCancelRideSchema = z.object({
  params: z.object({
    rideId: z.string().min(1, "Ride ID is required"),
  }),
  body: z
    .object({
      reason: z
        .string()
        .min(
          1,
          `Reason is required and should be one of: ${Object.values(DriverCancellationReason).join(", ")}`,
        ),
    })
    .passthrough(),
});
