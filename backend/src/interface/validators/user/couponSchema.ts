import { z } from "zod";

export const applyCouponSchema = z.object({
  params: z.object({
    rideId: z.string().min(1, "Ride ID is required"),
  }),
  body: z.object({
    couponCode: z.string().min(1, "Coupon code is required"),
  }),
});
