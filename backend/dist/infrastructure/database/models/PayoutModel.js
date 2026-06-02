"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutModel = void 0;
const mongoose_1 = require("mongoose");
const PayoutMethod_1 = require("@domain/value-objects/PayoutMethod");
const PayoutStatus_1 = require("@domain/value-objects/PayoutStatus");
const destinationSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["BANK", "UPI"], required: true },
    accountNumber: String,
    ifsc: String,
    beneficiaryName: String,
    bankName: String,
    upiId: String,
}, { _id: false });
const payoutSchema = new mongoose_1.Schema({
    payoutId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    driverId: {
        type: String,
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PayoutStatus_1.PayoutStatus),
        required: true,
        index: true,
    },
    method: {
        type: String,
        enum: Object.values(PayoutMethod_1.PayoutMethod),
        required: true,
    },
    destination: destinationSchema,
    externalPayoutId: String,
    fee: Number,
    feeCurrency: String,
    failureReason: String,
    processedAt: Date,
}, {
    timestamps: true,
});
payoutSchema.index({ driverId: 1, createdAt: -1 });
exports.PayoutModel = (0, mongoose_1.model)("Payout", payoutSchema);
//# sourceMappingURL=PayoutModel.js.map