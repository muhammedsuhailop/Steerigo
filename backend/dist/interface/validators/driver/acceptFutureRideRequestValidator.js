"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFutureRideRequestSchema = void 0;
const zod_1 = require("zod");
exports.acceptFutureRideRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        requestId: zod_1.z
            .string()
            .min(1, { message: "requestId is required" })
            .regex(/^[0-9a-fA-F]{24}$/, {
            message: "Invalid request id",
        }),
    })
        .strict(),
});
//# sourceMappingURL=acceptFutureRideRequestValidator.js.map