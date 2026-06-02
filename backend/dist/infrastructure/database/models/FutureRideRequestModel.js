"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureRideRequestModel = void 0;
const FutureRideRequestStatus_1 = require("@domain/value-objects/FutureRideRequestStatus");
const mongoose_1 = require("mongoose");
const futureRideRequestSchema = new mongoose_1.Schema({
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
        index: true,
    },
    driverUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    },
    requestGroupId: {
        type: String,
        required: true,
        index: true,
    },
    pickup: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
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
        },
        longitude: {
            type: Number,
            required: true,
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
    requiredDuration: {
        type: Number,
        min: 60,
    },
    rideType: {
        type: String,
        enum: ["One Way", "Round Trip"],
        required: true,
    },
    fareBreakdown: {
        baseFare: {
            amount: Number,
            currency: String,
        },
        platformFee: {
            amount: Number,
            currency: String,
        },
        taxes: {
            fare: {
                name: String,
                rate: Number,
                amount: {
                    amount: Number,
                    currency: String,
                },
            },
            platformFee: {
                name: String,
                rate: Number,
                amount: {
                    amount: Number,
                    currency: String,
                },
            },
        },
        totalFare: {
            amount: Number,
            currency: String,
        },
        durationHours: Number,
        calculatedAt: Date,
    },
    status: {
        type: String,
        enum: FutureRideRequestStatus_1.FutureRideRequestStatus,
        default: FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING,
        index: true,
    },
    pickupETA: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
// Indexes
futureRideRequestSchema.index({
    pickupTime: 1,
});
futureRideRequestSchema.index({
    riderId: 1,
    status: 1,
});
futureRideRequestSchema.index({
    driverId: 1,
    pickupTime: 1,
});
exports.FutureRideRequestModel = (0, mongoose_1.model)("FutureRideRequest", futureRideRequestSchema);
//# sourceMappingURL=FutureRideRequestModel.js.map