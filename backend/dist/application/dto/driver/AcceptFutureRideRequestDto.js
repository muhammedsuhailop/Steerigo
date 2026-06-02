"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptFutureRideRequestDto = void 0;
class AcceptFutureRideRequestDto {
    constructor(userId, requestId) {
        this.userId = userId;
        this.requestId = requestId;
    }
    static fromRequest(userId, requestBody) {
        const body = (requestBody ?? {});
        return new AcceptFutureRideRequestDto(userId, body.requestId);
    }
    getUserId() {
        return this.userId;
    }
    getRequestId() {
        return this.requestId;
    }
    validate() {
        if (!this.userId || this.userId.trim().length === 0) {
            throw new Error("userId is required");
        }
        if (!this.requestId || this.requestId.trim().length === 0) {
            throw new Error("requestId is required");
        }
    }
}
exports.AcceptFutureRideRequestDto = AcceptFutureRideRequestDto;
//# sourceMappingURL=AcceptFutureRideRequestDto.js.map