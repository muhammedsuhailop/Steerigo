import { z } from "zod";

export const rideIdParamSchema = z.object({
  params: z.object({
    rideId: z.string().min(1, "Ride ID is required"),
  }),
});

export type RideIdParamRequest = z.infer<typeof rideIdParamSchema>;
