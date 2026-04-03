import { z } from "zod";

export const getAdminRideByIdSchema = z.object({
  params: z.object({
    rideId: z.string().min(1, "Ride ID is required"),
  }),
});
