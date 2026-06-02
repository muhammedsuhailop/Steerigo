"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSearchAndRequestSchema = void 0;
const RideType_1 = require("@domain/value-objects/RideType");
const VehicleType_1 = require("@domain/value-objects/VehicleType");
const zod_1 = require("zod");
exports.autoSearchAndRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        latitude: zod_1.z
            .number()
            .min(-90, { message: "Latitude must be between -90 and 90" })
            .max(90, { message: "Latitude must be between -90 and 90" }),
        longitude: zod_1.z
            .number()
            .min(-180, { message: "Longitude must be between -180 and 180" })
            .max(180, { message: "Longitude must be between -180 and 180" }),
        searchDate: zod_1.z
            .string()
            .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, { message: "Search date must be a valid ISO8601 datetime" })
            .refine((val) => {
            const date = new Date(val);
            return date >= new Date(Date.now() - 5 * 60 * 1000);
        }, {
            message: "Search date cannot be in the past (allow 5 minutes tolerance)",
        }),
        timeRequired: zod_1.z
            .number()
            .int({ message: "Time required must be an integer" })
            .min(1, { message: "Time required must be at least 1 minute" })
            .max(480, {
            message: "Time required cannot exceed 480 minutes (8 hours)",
        }),
        radiusKm: zod_1.z
            .number()
            .min(0.1, { message: "Radius must be at least 0.1 km" })
            .max(50, { message: "Radius cannot exceed 50 km" })
            .optional()
            .default(10),
        gearType: zod_1.z.union([zod_1.z.enum(VehicleType_1.VALID_GEAR_TYPES), zod_1.z.literal("")]).optional(),
        bodyType: zod_1.z.union([zod_1.z.enum(VehicleType_1.VALID_BODY_TYPES), zod_1.z.literal("")]).optional(),
        maxRideRequests: zod_1.z
            .number()
            .int({ message: "Max ride requests must be an integer" })
            .min(1, { message: "Max ride requests must be at least 1" })
            .max(20, { message: "Max ride requests cannot exceed 20" })
            .optional()
            .default(5),
        dropLatitude: zod_1.z
            .number()
            .min(-90, { message: "Drop latitude must be between -90 and 90" })
            .max(90, { message: "Drop latitude must be between -90 and 90" }),
        dropLongitude: zod_1.z
            .number()
            .min(-180, { message: "Drop longitude must be between -180 and 180" })
            .max(180, { message: "Drop longitude must be between -180 and 180" }),
        dropAddress: zod_1.z
            .string()
            .max(500, {
            message: "Drop address must be a string with maximum 500 characters",
        })
            .optional(),
        pickupAddress: zod_1.z
            .string()
            .max(500, {
            message: "Pickup address must be a string with maximum 500 characters",
        })
            .optional(),
        rideType: zod_1.z.enum(RideType_1.RideType, {
            message: "Ride type must be either 'One Way' or 'Round Trip'",
        }),
        requestGroupId: zod_1.z
            .string()
            .min(1, { message: "requestGroupId is required" })
            .regex(/^[0-9a-fA-F]{24}$/, {
            message: "requestGroupId must be a 24-character hex string (MongoDB ObjectId)",
        }),
    })
        .strict(),
});
//# sourceMappingURL=autoSearchAndRequestValidators.js.map