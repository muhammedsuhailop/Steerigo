"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRideRequestSchema = exports.RejectRideRequestDto = void 0;
const zod_1 = require("zod");
const rejectRideRequestSchema = zod_1.z.object({
    requestId: zod_1.z.string().min(1, "Request ID is required"),
    reason: zod_1.z.string().min(1, "Rejection reason is required").optional(),
});
exports.rejectRideRequestSchema = rejectRideRequestSchema;
class RejectRideRequestDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = rejectRideRequestSchema.parse(requestData);
    }
    static fromRequest(userId, requestBody) {
        return new RejectRideRequestDto(userId, requestBody);
    }
    getUserId() {
        return this.userId;
    }
    getRequestId() {
        return this.data.requestId;
    }
    getReason() {
        return this.data.reason;
    }
}
exports.RejectRideRequestDto = RejectRideRequestDto;
//# sourceMappingURL=RejectRideRequestDto.js.map