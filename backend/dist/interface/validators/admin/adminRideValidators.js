"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminRideByIdSchema = void 0;
const zod_1 = require("zod");
exports.getAdminRideByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
});
//# sourceMappingURL=adminRideValidators.js.map