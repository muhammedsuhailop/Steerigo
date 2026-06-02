"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideRequestIdParamSchema = void 0;
const zod_1 = require("zod");
exports.rideRequestIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        requestId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Request ID format")
            .nonempty("Request ID is required"),
    }),
});
//# sourceMappingURL=rideRequestIdParamSchema.js.map