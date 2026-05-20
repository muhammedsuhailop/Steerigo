import { z } from "zod";

export const rejectFutureRideRequestSchema = z.object({
  body: z
    .object({
      requestId: z
        .string()
        .min(1, { message: "requestId is required" })
    })
    .strict(),
});

export type RejectFutureRideRequestInput = z.infer<
  typeof rejectFutureRideRequestSchema
>;
