import { z } from "zod";

const rideIdRegex = /^RIDE-[0-9a-fA-F]{24}$/;

export const rideChatRoomParamSchema = z.object({
  params: z.object({
    rideId: z
      .string()
      .min(1, "Ride ID is required")
      .regex(rideIdRegex, "Invalid Ride ID"),
  }),
});
