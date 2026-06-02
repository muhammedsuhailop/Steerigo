"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestGroupModel = void 0;
const mongoose_1 = require("mongoose");
const RideRequestGroupStatus_1 = require("@domain/value-objects/RideRequestGroupStatus");
const RideLocationSchema = new mongoose_1.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
}, { _id: false });
const RideRequestGroupSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    pickup: { type: RideLocationSchema, required: true },
    drop: { type: RideLocationSchema, required: true },
    timeRequired: { type: Number, min: 1, max: 12 },
    rideType: { type: String, required: true },
    fareBreakdown: {
        baseFare: {
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            currency: {
                type: String,
                required: true,
                default: "INR",
            },
        },
        platformFee: {
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            currency: {
                type: String,
                required: true,
                default: "INR",
            },
        },
        taxes: {
            fare: {
                name: {
                    type: String,
                    required: true,
                },
                rate: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100,
                },
                amount: {
                    amount: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                    currency: {
                        type: String,
                        required: true,
                        default: "INR",
                    },
                },
            },
            platformFee: {
                name: {
                    type: String,
                    required: true,
                },
                rate: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100,
                },
                amount: {
                    amount: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                    currency: {
                        type: String,
                        required: true,
                        default: "INR",
                    },
                },
            },
        },
        totalFare: {
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            currency: {
                type: String,
                required: true,
                default: "INR",
            },
        },
        durationHours: {
            type: Number,
            required: true,
            min: 0,
        },
        calculatedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    candidateDriverIds: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver", required: true },
    ],
    currentIndex: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: Object.values(RideRequestGroupStatus_1.RideRequestGroupStatus),
        required: true,
    },
}, {
    timestamps: true,
    collection: "ride_request_groups",
});
exports.RideRequestGroupModel = (0, mongoose_1.model)("RideRequestGroup", RideRequestGroupSchema);
//# sourceMappingURL=RideRequestGroupModel.js.map