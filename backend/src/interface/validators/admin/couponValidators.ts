import { z } from "zod";

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Coupon code is required"),
    discountType: z.string().min(1, "Discount type is required"),
    discountValue: z.number("Discount value is required"),
    maxDiscount: z.number().optional(),
    minRideAmount: z.number().optional(),
    usageLimit: z.number().optional(),
    usagePerUser: z.number().optional(),
    validFrom: z.string().optional(),
    validTo: z.string().optional(),
  }),
});

export const editCouponSchema = z.object({
  params: z.object({
    couponId: z
      .string("Coupon ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Coupon ID format"),
  }),
  body: z.object({
    discountType: z.string().optional(),
    discountValue: z.number().optional(),
    maxDiscount: z.number().nullable().optional(),
    minRideAmount: z.number().nullable().optional(),
    usageLimit: z.number().nullable().optional(),
    usagePerUser: z.number().nullable().optional(),
    validFrom: z.string().nullable().optional(),
    validTo: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getAdminCouponsSchema = z.object({
  query: z.object({
    code: z.string().optional(),
    discountType: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
    validFromStart: z.string().optional(),
    validFromEnd: z.string().optional(),
    validToStart: z.string().optional(),
    validToEnd: z.string().optional(),
    sortBy: z
      .enum(["code", "discountValue", "createdAt", "validFrom", "validTo"])
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
