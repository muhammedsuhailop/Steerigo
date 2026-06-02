"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRidesSchema = void 0;
const zod_1 = require("zod");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const validRideStatuses = Object.values(RideStatus_1.RideStatus);
exports.getUserRidesSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined))
            .refine((val) => val === undefined || (val > 0 && !isNaN(val)), {
            message: "Page must be a positive integer",
        }),
        limit: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined))
            .refine((val) => val === undefined || (val > 0 && val <= 100 && !isNaN(val)), { message: "Limit must be between 1 and 100" }),
        sortBy: zod_1.z.enum(["createdAt", "updatedAt", "fare"]).optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
        status: zod_1.z.enum(validRideStatuses).optional(),
        fromDate: zod_1.z
            .string()
            .optional()
            .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
            message: "fromDate must be a valid ISO date string",
        }),
        toDate: zod_1.z
            .string()
            .optional()
            .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
            message: "toDate must be a valid ISO date string",
        }),
    }),
});
//# sourceMappingURL=getUserRidesSchema.js.map