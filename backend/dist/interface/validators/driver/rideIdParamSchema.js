"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideIdParamSchema = void 0;
const zod_1 = require("zod");
exports.rideIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
});
//# sourceMappingURL=rideIdParamSchema.js.map