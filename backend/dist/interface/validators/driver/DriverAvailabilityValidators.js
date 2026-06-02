"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocationSchema = exports.updateStatusSchema = exports.addAvailabilityExceptionSchema = exports.scheduleRecurringAvailabilitySchema = void 0;
const AvailabilityExceptionType_1 = require("../../../domain/value-objects/AvailabilityExceptionType");
const AvailabilityStatus_1 = require("../../../domain/value-objects/AvailabilityStatus");
const RecurringPattern_1 = require("../../../domain/value-objects/RecurringPattern");
const zod_1 = require("zod");
exports.scheduleRecurringAvailabilitySchema = zod_1.z.object({
    body: zod_1.z.object({
        daysOfWeek: zod_1.z
            .array(zod_1.z.number().int().min(0).max(6))
            .min(1, "At least one day must be selected"),
        timeSlots: zod_1.z
            .array(zod_1.z.object({
            startTime: zod_1.z.number().int().min(0).max(1440),
            endTime: zod_1.z.number().int().min(0).max(1440),
        }))
            .min(1, "At least one time slot must be defined"),
        excludedTimeSlots: zod_1.z
            .array(zod_1.z.object({
            startTime: zod_1.z.number().int().min(0).max(1440),
            endTime: zod_1.z.number().int().min(0).max(1440),
        }))
            .optional(),
        validityStartDate: zod_1.z
            .string()
            .datetime("Invalid datetime format for validityStartDate"),
        validityEndDate: zod_1.z
            .string()
            .datetime("Invalid datetime format for validityEndDate")
            .optional(),
        notes: zod_1.z.string().max(1000).optional(),
        currentLocation: zod_1.z.object({
            latitude: zod_1.z
                .number()
                .min(-90, "Latitude must be between -90 and 90")
                .max(90, "Latitude must be between -90 and 90"),
            longitude: zod_1.z
                .number()
                .min(-180, "Longitude must be between -180 and 180")
                .max(180, "Longitude must be between -180 and 180"),
            address: zod_1.z
                .string()
                .max(500, "Address must not exceed 500 characters")
                .optional(),
        }),
    }),
});
exports.addAvailabilityExceptionSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.nativeEnum(AvailabilityExceptionType_1.AvailabilityExceptionType),
        reason: zod_1.z.string().max(500).optional(),
        startTime: zod_1.z.string().datetime("Invalid datetime format for startTime"),
        endTime: zod_1.z.string().datetime("Invalid datetime format for endTime"),
        isRecurring: zod_1.z.boolean().optional(),
        recurringPattern: zod_1.z.nativeEnum(RecurringPattern_1.RecurringPattern).optional(),
    }),
});
exports.updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        driverId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "driverId must be a valid MongoDB ID")
            .nonempty({ message: "driverId is required" }),
        status: zod_1.z.nativeEnum(AvailabilityStatus_1.AvailabilityStatus, {
            message: "Status must be one of: Available, Busy, Offline, Scheduled",
        }),
    }),
});
exports.updateLocationSchema = zod_1.z.object({
    body: zod_1.z.object({
        driverId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "driverId must be a valid MongoDB ID")
            .nonempty({ message: "driverId is required" }),
        currentLocation: zod_1.z.object({
            latitude: zod_1.z
                .number()
                .min(-90, "Latitude must be between -90 and 90")
                .max(90, "Latitude must be between -90 and 90"),
            longitude: zod_1.z
                .number()
                .min(-180, "Longitude must be between -180 and 180")
                .max(180, "Longitude must be between -180 and 180"),
            address: zod_1.z
                .string()
                .max(500, "Address must not exceed 500 characters")
                .optional(),
        }),
    }),
});
//# sourceMappingURL=DriverAvailabilityValidators.js.map