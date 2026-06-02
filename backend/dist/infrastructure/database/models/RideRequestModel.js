"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestModel = void 0;
const mongoose_1 = require("mongoose");
const rideRequestSchema = new mongoose_1.Schema({
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
        index: true,
    },
    driverUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    requestGroupId: {
        type: String,
        required: true,
        index: true,
    },
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    pickup: {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180,
        },
        address: {
            type: String,
            trim: true,
        },
    },
    drop: {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180,
        },
        address: {
            type: String,
            trim: true,
        },
    },
    pickupTime: {
        type: Date,
        required: true,
    },
    timeRequired: {
        type: Number,
        min: 1,
        max: 12,
    },
    rideType: {
        type: String,
        enum: ["One Way", "Round Trip"],
        required: true,
    },
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
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Expired"],
        default: "Pending",
        index: true,
    },
    pickupETA: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 1.5 * 60 * 1000),
    },
}, {
    timestamps: true,
});
// Indexes
rideRequestSchema.index({ driverId: 1, status: 1 });
rideRequestSchema.index({ driverUserId: 1, status: 1 });
rideRequestSchema.index({ driverId: 1, pickupTime: 1 });
rideRequestSchema.index({ riderId: 1, status: 1 });
rideRequestSchema.index({ createdAt: 1 });
rideRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
rideRequestSchema.index({ requestGroupId: 1, driverId: 1 }, { unique: true });
// RideRequest Model
exports.RideRequestModel = (0, mongoose_1.model)("RideRequest", rideRequestSchema);
//# sourceMappingURL=RideRequestModel.js.map