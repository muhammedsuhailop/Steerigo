import { z } from "zod";
import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";

export const editAvailabilityExceptionSchema = z.object({
  params: z.object({
    exceptionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Exception ID must be a valid MongoDB ID"),
  }),

  body: z
    .object({
      type: z.nativeEnum(AvailabilityExceptionType).optional(),

      reason: z.string().max(500).optional(),

      startTime: z.string().datetime("Invalid datetime format").optional(),

      endTime: z.string().datetime("Invalid datetime format").optional(),
    })

    // At least one field
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const removeAvailabilityExceptionSchema = z.object({
  params: z.object({
    exceptionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Exception ID must be a valid MongoDB ID"),
  }),
});
