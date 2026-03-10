import { z } from "zod";

export const rideRequestIdParamSchema = z.object({
  params: z.object({
    requestId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Request ID format")
      .nonempty("Request ID is required"),
  }),
});
