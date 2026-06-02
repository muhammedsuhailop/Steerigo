"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAvailabilityExceptionSchema = exports.editAvailabilityExceptionSchema = void 0;
const zod_1 = require("zod");
const AvailabilityExceptionType_1 = require("@domain/value-objects/AvailabilityExceptionType");
exports.editAvailabilityExceptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        exceptionId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Exception ID must be a valid MongoDB ID"),
    }),
    body: zod_1.z
        .object({
        type: zod_1.z.nativeEnum(AvailabilityExceptionType_1.AvailabilityExceptionType).optional(),
        reason: zod_1.z.string().max(500).optional(),
        startTime: zod_1.z.string().datetime("Invalid datetime format").optional(),
        endTime: zod_1.z.string().datetime("Invalid datetime format").optional(),
    })
        // At least one field
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    }),
});
exports.removeAvailabilityExceptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        exceptionId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Exception ID must be a valid MongoDB ID"),
    }),
});
//# sourceMappingURL=EditAvailabilityExceptionValidators.js.map