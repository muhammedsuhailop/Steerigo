import { z } from "zod";

const objectIdRideRegex = /^RIDE-[0-9a-fA-F]{24}$/;

export const createRideChatRoomRouteSchema = z.object({
  params: z.object({
    rideId: z
      .string()
      .min(1, "Ride ID is required")
      .refine(
        (value) => {
          // Mongo ObjectId format
          if (objectIdRideRegex.test(value)) {
            return true;
          }

          // UUID format
          if (value.startsWith("RIDE-")) {
            const uuidPart = value.replace("RIDE-", "");

            return z.uuid().safeParse(uuidPart).success;
          }

          return false;
        },
        {
          message: "Invalid Ride ID",
        },
      ),
  }),
});
