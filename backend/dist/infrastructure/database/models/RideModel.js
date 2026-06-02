"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideModel = void 0;
const BookingType_1 = require("@domain/value-objects/BookingType");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const RideType_1 = require("@domain/value-objects/RideType");
const mongoose_1 = require("mongoose");
const rideSchema = new mongoose_1.Schema({
    rideId: { type: String, required: true, unique: true, index: true },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
        index: true,
    },
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(RideStatus_1.RideStatus),
        default: RideStatus_1.RideStatus.REQUESTED,
        index: true,
    },
    paymentStatus: {
        type: String,
        enum: PaymentStatus_1.PaymentStatus,
        default: PaymentStatus_1.PaymentStatus.PENDING,
        index: true,
    },
    pickup: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    drop: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    requestedPickupTime: {
        type: Date,
    },
    timeRequired: {
        type: Number,
        min: 1,
        max: 12,
    },
    rideType: { type: String, enum: RideType_1.RideType, required: true },
    bookingType: {
        type: String,
        enum: BookingType_1.BookingType,
        default: BookingType_1.BookingType.INSTANT,
    },
    fareBreakdown: {
        baseFare: { type: Number, default: 0 },
        timeFare: { type: Number, default: 0 },
        platformFee: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        surgeMultiplier: { type: Number, default: 1 },
        totalFare: { type: Number, default: 0 },
    },
    currency: { type: String, default: "INR" },
    timeline: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: Date,
        arrivedAt: Date,
        startedAt: Date,
        completedAt: Date,
        cancelledAt: Date,
        rejectedAt: Date,
        paymentInitiatedAt: Date,
        paymentCompletedAt: Date,
        paymentFailedAt: Date,
        paymentRefundedAt: Date,
    },
    verificationCode: {
        type: Number,
        min: 1000,
        max: 9999,
        default: () => Math.floor(1000 + Math.random() * 9000),
    },
    coupon: {
        couponId: { type: mongoose_1.Schema.Types.ObjectId },
        code: { type: String },
        discountAmount: { type: Number },
        discountType: { type: String },
    },
    rating: Number,
    feedback: String,
}, { timestamps: true });
exports.RideModel = (0, mongoose_1.model)("Ride", rideSchema);
//# sourceMappingURL=RideModel.js.map