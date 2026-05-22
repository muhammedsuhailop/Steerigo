import { z } from "zod";

export const acceptFutureRideRequestSchema = z.object({
  body: z
    .object({
      requestId: z
        .string()
        .min(1, { message: "requestId is required" })
        .regex(/^[0-9a-fA-F]{24}$/, {
          message:
            "Invalid request id",
        }),
    })
    .strict(),
});

export type AcceptFutureRideRequestInput = z.infer<
  typeof acceptFutureRideRequestSchema
>;
