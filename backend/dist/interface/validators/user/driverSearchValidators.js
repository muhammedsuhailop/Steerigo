"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearbyDriversSearchSchema = exports.locationSchema = void 0;
const zod_1 = require("zod");
const VALID_GEAR_TYPES = ["Manual", "Automatic"];
const VALID_BODY_TYPES = ["Sedan", "SUV", "Hatchback"];
// Location schema
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
exports.findNearbyDriversSearchSchema = zod_1.z.object({
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
            // Allow 5 minutes tolerance for clock skew
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
        gearType: zod_1.z.union([zod_1.z.enum(VALID_GEAR_TYPES), zod_1.z.literal("")]),
        bodyType: zod_1.z.union([zod_1.z.enum(VALID_BODY_TYPES), zod_1.z.literal("")]),
        limit: zod_1.z
            .number()
            .int({ message: "Limit must be an integer" })
            .min(1, { message: "Limit must be at least 1" })
            .max(100, { message: "Limit cannot exceed 100" })
            .optional()
            .default(20),
    })
        .strict(),
});
//# sourceMappingURL=driverSearchValidators.js.map