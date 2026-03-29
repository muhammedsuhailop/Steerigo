import { z } from "zod";
import { RatingCriteriaType } from "@domain/value-objects/RatingCriteriaType";

const dynamicCriteriaShape = Object.values(RatingCriteriaType).reduce(
  (acc, key) => {
    acc[key] = z.any();
    return acc;
  },
  {} as Record<string, z.ZodTypeAny>,
);

export const rateRideSchema = z.object({
  params: z.object({
    rideId: z.string().min(1, "Ride ID is required"),
  }),
  body: z.object({
    criteria: z.object(dynamicCriteriaShape),
    review: z.string().optional(),
  }),
});
