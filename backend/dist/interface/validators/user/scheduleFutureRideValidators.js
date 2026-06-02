"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelFutureRideSchema = exports.scheduleFutureRideSchema = void 0;
const zod_1 = require("zod");
const RideType_1 = require("@domain/value-objects/RideType");
const VehicleType_1 = require("@domain/value-objects/VehicleType");
const AppConstants_1 = require("@shared/constants/AppConstants");
exports.scheduleFutureRideSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        requestGroupId: zod_1.z
            .string()
            .min(1, { message: "requestGroupId is required" })
            .regex(/^[0-9a-fA-F]{24}$/, {
            message: "requestGroupId must be a 24-character hex string (MongoDB ObjectId)",
        }),
        latitude: zod_1.z
            .number()
            .min(-90, { message: "Latitude must be between -90 and 90" })
            .max(90, { message: "Latitude must be between -90 and 90" }),
        longitude: zod_1.z
            .number()
            .min(-180, { message: "Longitude must be between -180 and 180" })
            .max(180, { message: "Longitude must be between -180 and 180" }),
        pickupTime: zod_1.z
            .string()
            .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, { message: "pickupTime must be a valid ISO8601 datetime" })
            .refine((val) => {
            const date = new Date(val);
            const minAllowed = new Date(Date.now() +
                AppConstants_1.AppConstants.FUTURE_RIDE_MIN_HOURS_AHEAD * 60 * 60 * 1000);
            return date >= minAllowed;
        }, {
            message: `Pickup time must be at least ${AppConstants_1.AppConstants.FUTURE_RIDE_MIN_HOURS_AHEAD} hours from now`,
        }),
        radiusKm: zod_1.z
            .number()
            .min(0.1, { message: "Radius must be at least 0.1 km" })
            .max(50, { message: "Radius cannot exceed 50 km" })
            .optional()
            .default(AppConstants_1.AppConstants.FUTURE_RIDE_DEFAULT_RADIUS_KM),
        gearType: zod_1.z.union([zod_1.z.enum(VehicleType_1.VALID_GEAR_TYPES), zod_1.z.literal("")]).optional(),
        bodyType: zod_1.z.union([zod_1.z.enum(VehicleType_1.VALID_BODY_TYPES), zod_1.z.literal("")]).optional(),
        maxCandidates: zod_1.z
            .number()
            .int({ message: "maxCandidates must be an integer" })
            .min(1, { message: "maxCandidates must be at least 1" })
            .max(20, { message: "maxCandidates cannot exceed 20" })
            .optional()
            .default(AppConstants_1.AppConstants.FUTURE_RIDE_MAX_CANDIDATES),
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
            .max(500, { message: "Drop address cannot exceed 500 characters" })
            .optional(),
        pickupAddress: zod_1.z
            .string()
            .max(500, { message: "Pickup address cannot exceed 500 characters" })
            .optional(),
        rideType: zod_1.z.enum(RideType_1.RideType, {
            message: "Ride type must be either 'One Way' or 'Round Trip'",
        }),
        requiredDuration: zod_1.z.number().min(1),
    })
        .strict(),
});
exports.cancelFutureRideSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        requestGroupId: zod_1.z
            .string()
            .min(1, { message: "requestGroupId is required" })
            .regex(/^[0-9a-fA-F]{24}$/, {
            message: "requestGroupId must be a 24-character hex string (MongoDB ObjectId)",
        }),
    })
        .strict(),
});
//# sourceMappingURL=scheduleFutureRideValidators.js.map