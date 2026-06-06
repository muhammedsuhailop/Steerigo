"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCouponSchema = exports.applyCouponSchema = void 0;
const zod_1 = require("zod");
exports.applyCouponSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
    body: zod_1.z.object({
        couponCode: zod_1.z.string().min(1, "Coupon code is required"),
    }),
});
exports.removeCouponSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
});
//# sourceMappingURL=couponSchema.js.map