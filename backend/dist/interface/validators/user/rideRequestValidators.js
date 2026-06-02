"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRideRequestSchema = exports.locationSchema = void 0;
const zod_1 = require("zod");
const VALID_RIDE_TYPES = ["One Way", "Round Trip"];
exports.locationSchema = zod_1.z.object({
    latitude: zod_1.z
        .number()
        .min(-90, { message: "Latitude must be between -90 and 90" })
        .max(90, { message: "Latitude must be between -90 and 90" }),
    longitude: zod_1.z
        .number()
        .min(-180, { message: "Longitude must be between -180 and 180" })
        .max(180, { message: "Longitude must be between -180 and 180" }),
    address: zod_1.z
        .string()
        .max(500, {
        message: "Address must be a string with maximum 500 characters",
    })
        .optional(),
});
const moneySchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, { message: "Amount must be non-negative" }),
    currency: zod_1.z.string().default("INR"),
});
const taxBreakdownSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Tax name is required" }),
    rate: zod_1.z
        .number()
        .min(0, { message: "Tax rate must be non-negative" })
        .max(100, { message: "Tax rate cannot exceed 100%" }),
    amount: moneySchema,
});
const fareBreakdownSchema = zod_1.z.object({
    baseFare: moneySchema,
    platformFee: moneySchema,
    taxes: zod_1.z.object({
        fare: taxBreakdownSchema,
        platformFee: taxBreakdownSchema,
    }),
    totalFare: moneySchema,
    durationHours: zod_1.z
        .number()
        .min(0, { message: "Duration must be non-negative" }),
});
// Send Ride Request Schema
exports.sendRideRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        requestGroupId: zod_1.z
            .string()
            .min(1, { message: "requestGroupId is required" })
            .regex(/^[0-9a-fA-F]{24}$/, {
            message: "requestGroupId must be a valid 24-character MongoDB ObjectId",
        }),
        driverId: zod_1.z
            .string()
            .min(1, { message: "Driver ID is required" })
            .regex(/^[0-9a-fA-F]{24}$/, {
            message: "Driver ID must be a valid MongoDB ObjectId",
        }),
        pickup: exports.locationSchema,
        drop: exports.locationSchema,
        pickupTime: zod_1.z
            .string()
            .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, { message: "Pickup time must be a valid ISO8601 datetime" })
            .refine((val) => {
            const date = new Date(val);
            // Allow 5 minutes tolerance for clock skew
            return date >= new Date(Date.now() - 5 * 60 * 1000);
        }, {
            message: "Pickup time cannot be in the past (allow 5 minutes tolerance)",
        }),
        rideType: zod_1.z.enum(VALID_RIDE_TYPES, {
            message: "Ride type must be either 'One Way' or 'Round Trip'",
        }),
        fareBreakdown: fareBreakdownSchema,
        pickupETA: zod_1.z
            .string()
            .min(1, { message: "Pickup ETA is required" })
            .max(50, { message: "Pickup ETA must not exceed 50 characters" }),
    })
        .strict(),
});
//# sourceMappingURL=rideRequestValidators.js.map