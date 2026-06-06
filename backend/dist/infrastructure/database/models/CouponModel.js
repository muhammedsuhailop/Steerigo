"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModel = void 0;
const mongoose_1 = require("mongoose");
const CouponDiscountType_1 = require("../../../domain/value-objects/CouponDiscountType");
const couponSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true, index: true },
    discountType: {
        type: String,
        enum: Object.values(CouponDiscountType_1.CouponDiscountType),
        required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    minRideAmount: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 0 },
    usagePerUser: { type: Number, min: 0 },
    validFrom: { type: Date },
    validTo: { type: Date },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validTo: 1 });
exports.CouponModel = (0, mongoose_1.model)("Coupon", couponSchema);
//# sourceMappingURL=CouponModel.js.map