"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectFutureRideRequestDto = void 0;
const zod_1 = require("zod");
const rejectFutureRideRequestSchema = zod_1.z.object({
    requestId: zod_1.z
        .string()
        .min(1, { message: "requestId is required" })
        .regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid requestId",
    }),
});
class RejectFutureRideRequestDto {
    constructor(userId, data) {
        this.userId = userId;
        this.data = data;
    }
    static fromRequest(userId, requestBody) {
        const data = rejectFutureRideRequestSchema.parse((requestBody ?? {}));
        return new RejectFutureRideRequestDto(userId, data);
    }
    getUserId() {
        return this.userId;
    }
    getRequestId() {
        return this.data.requestId;
    }
}
exports.RejectFutureRideRequestDto = RejectFutureRideRequestDto;
//# sourceMappingURL=RejectFutureRideRequestDto.js.map