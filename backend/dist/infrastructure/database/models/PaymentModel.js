"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const PaymentMethod_1 = require("@domain/value-objects/PaymentMethod");
const PaymentFailureReason_1 = require("@domain/value-objects/PaymentFailureReason");
const paymentSchema = new mongoose_1.Schema({
    paymentId: { type: String, required: true, unique: true, index: true },
    rideId: { type: String, required: true },
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    amount: { type: Number, required: true, min: 0 },
    refundedAmount: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, required: true, default: "INR" },
    method: {
        type: String,
        enum: Object.values(PaymentMethod_1.PaymentMethod),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus_1.PaymentStatus),
        required: true,
        index: true,
    },
    paymentIntentId: { type: String },
    gateway: { type: String },
    gatewayOrderId: { type: String },
    gatewayPaymentId: { type: String },
    gatewaySignature: { type: String },
    failureReason: { type: String, enum: Object.values(PaymentFailureReason_1.PaymentFailureReason) },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    paidAt: { type: Date },
}, { timestamps: true });
paymentSchema.index({ rideId: 1 });
paymentSchema.index({ riderId: 1 });
paymentSchema.index({ driverId: 1 });
exports.PaymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
//# sourceMappingURL=PaymentModel.js.map