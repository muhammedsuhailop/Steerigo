"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRideSchema = void 0;
const zod_1 = require("zod");
exports.cancelRideSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(1, "Cancellation reason is required"),
    }),
});
//# sourceMappingURL=cancelRideSchema.js.map