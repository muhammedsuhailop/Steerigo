"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptRideRequestSchema = exports.AcceptRideRequestDto = void 0;
const zod_1 = require("zod");
const acceptRideRequestSchema = zod_1.z.object({
    requestId: zod_1.z.string().min(1, "Request ID is required"),
});
exports.acceptRideRequestSchema = acceptRideRequestSchema;
class AcceptRideRequestDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = acceptRideRequestSchema.parse(requestData);
    }
    static fromRequest(userId, requestBody) {
        return new AcceptRideRequestDto(userId, requestBody);
    }
    getUserId() {
        return this.userId;
    }
    getRequestId() {
        return this.data.requestId;
    }
}
exports.AcceptRideRequestDto = AcceptRideRequestDto;
//# sourceMappingURL=AcceptRideRequestDto.js.map