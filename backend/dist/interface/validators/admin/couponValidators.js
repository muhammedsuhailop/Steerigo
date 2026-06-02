"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminCouponsSchema = exports.editCouponSchema = exports.createCouponSchema = void 0;
const zod_1 = require("zod");
exports.createCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(1, "Coupon code is required"),
        discountType: zod_1.z.string().min(1, "Discount type is required"),
        discountValue: zod_1.z.number("Discount value is required"),
        maxDiscount: zod_1.z.number().optional(),
        minRideAmount: zod_1.z.number().optional(),
        usageLimit: zod_1.z.number().optional(),
        usagePerUser: zod_1.z.number().optional(),
        validFrom: zod_1.z.string().optional(),
        validTo: zod_1.z.string().optional(),
    }),
});
exports.editCouponSchema = zod_1.z.object({
    params: zod_1.z.object({
        couponId: zod_1.z
            .string("Coupon ID is required")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Coupon ID format"),
    }),
    body: zod_1.z.object({
        discountType: zod_1.z.string().optional(),
        discountValue: zod_1.z.number().optional(),
        maxDiscount: zod_1.z.number().nullable().optional(),
        minRideAmount: zod_1.z.number().nullable().optional(),
        usageLimit: zod_1.z.number().nullable().optional(),
        usagePerUser: zod_1.z.number().nullable().optional(),
        validFrom: zod_1.z.string().nullable().optional(),
        validTo: zod_1.z.string().nullable().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getAdminCouponsSchema = zod_1.z.object({
    query: zod_1.z.object({
        code: zod_1.z.string().optional(),
        discountType: zod_1.z.string().optional(),
        isActive: zod_1.z.enum(["true", "false"]).optional(),
        validFromStart: zod_1.z.string().optional(),
        validFromEnd: zod_1.z.string().optional(),
        validToStart: zod_1.z.string().optional(),
        validToEnd: zod_1.z.string().optional(),
        sortBy: zod_1.z
            .enum(["code", "discountValue", "createdAt", "validFrom", "validTo"])
            .optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=couponValidators.js.map