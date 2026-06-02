"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverCancelRideSchema = void 0;
const DriverRideCancellationReason_1 = require("../../../domain/value-objects/DriverRideCancellationReason");
const zod_1 = require("zod");
exports.driverCancelRideSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
    body: zod_1.z
        .object({
        reason: zod_1.z
            .string()
            .min(1, `Reason is required and should be one of: ${Object.values(DriverRideCancellationReason_1.DriverCancellationReason).join(", ")}`),
    })
        .passthrough(),
});
//# sourceMappingURL=driverCancelRideSchema.js.map