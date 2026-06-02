"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectFutureRideRequestSchema = void 0;
const zod_1 = require("zod");
exports.rejectFutureRideRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        requestId: zod_1.z
            .string()
            .min(1, { message: "requestId is required" })
    })
        .strict(),
});
//# sourceMappingURL=rejectFutureRideRequestValidator.js.map