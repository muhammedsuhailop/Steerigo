import { z } from "zod";
import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

const bankDestinationSchema = z.object({
  type: z.literal("BANK"),
  accountNumber: z.string().min(8).max(20),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  beneficiaryName: z.string().min(2),
  bankName: z.string().optional(),
});

const upiDestinationSchema = z.object({
  type: z.literal("UPI"),
  upiId: z.string().regex(/^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID"),
  beneficiaryName: z.string().optional(),
});

export const requestPayoutSchema = z.object({
  body: z.object({
    amount: z
      .number({ error: "amount is required" })
      .min(100, "Minimum payout amount is ₹100"),
    method: z.nativeEnum(PayoutMethod,
      { message: "Invalid payout method" },
    ),
    destination: z.discriminatedUnion("type", [
      bankDestinationSchema,
      upiDestinationSchema,
    ]),
  }),
});

export const approvePayoutSchema = z.object({
  params: z.object({
    payoutId: z.string().min(1, "payoutId is required"),
  }),
});

export const rejectPayoutSchema = z.object({
  params: z.object({
    payoutId: z.string().min(1, "payoutId is required"),
  }),
  body: z.object({
    reason: z.string().min(5, "Rejection reason must be at least 5 characters"),
  }),
});

export const getAdminPayoutsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(PayoutStatus).optional(),
    driverId: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    sortBy: z.enum(["createdAt", "amount"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});
