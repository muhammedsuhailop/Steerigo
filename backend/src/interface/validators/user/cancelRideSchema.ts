import { z } from "zod";

export const cancelRideSchema = z.object({
  params: z.object({
    rideId: z.string().min(1, "Ride ID is required"),
  }),
  body: z.object({
    reason: z.string().min(1, "Cancellation reason is required"),
  }),
});
