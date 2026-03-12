import { z } from "zod";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";

export const initiatePaymentSchema = z.object({
  body: z.object({
    rideId: z.string().min(1, "rideId is required"),
    method: z.nativeEnum(PaymentMethod, { message: "Invalid payment method" }),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1, "paymentId is required"),
    gatewayOrderId: z.string().min(1, "gatewayOrderId is required"),
    gatewayPaymentId: z.string().min(1, "gatewayPaymentId is required"),
    gatewaySignature: z.string().min(1, "gatewaySignature is required"),
  }),
});

export const confirmCashPaymentSchema = z.object({
  params: z.object({
    paymentId: z.string().min(1, "paymentId is required"),
  }),
});
