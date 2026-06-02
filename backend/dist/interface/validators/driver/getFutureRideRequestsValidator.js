"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFutureRideRequestsSchema = void 0;
const zod_1 = require("zod");
const FutureRideRequestStatus_1 = require("@domain/value-objects/FutureRideRequestStatus");
exports.getFutureRideRequestsSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        status: zod_1.z
            .nativeEnum(FutureRideRequestStatus_1.FutureRideRequestStatus, {
            message: `status must be one of: ${Object.values(FutureRideRequestStatus_1.FutureRideRequestStatus).join(", ")}`,
        })
            .optional(),
        page: zod_1.z.coerce
            .number({
            message: "page must be a number",
        })
            .int({ message: "page must be an integer" })
            .positive({ message: "page must be a positive number" })
            .optional()
            .default(1),
        limit: zod_1.z.coerce
            .number({
            message: "limit must be a number",
        })
            .int({ message: "limit must be an integer" })
            .positive({ message: "limit must be a positive number" })
            .max(100, {
            message: "limit cannot exceed 100",
        })
            .optional()
            .default(10),
    })
        .strict(),
});
//# sourceMappingURL=getFutureRideRequestsValidator.js.map