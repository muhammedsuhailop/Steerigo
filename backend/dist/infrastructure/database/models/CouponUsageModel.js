"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsageModel = void 0;
const mongoose_1 = require("mongoose");
const couponUsageSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    couponId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    rideId: {
        type: String,
        required: true,
        index: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    usedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
couponUsageSchema.index({ userId: 1, couponId: 1 });
couponUsageSchema.index({ userId: 1, couponId: 1, rideId: 1 }, { unique: true });
exports.CouponUsageModel = (0, mongoose_1.model)("CouponUsage", couponUsageSchema);
//# sourceMappingURL=CouponUsageModel.js.map