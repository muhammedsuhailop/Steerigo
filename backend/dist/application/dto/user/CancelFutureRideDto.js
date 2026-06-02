"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelFutureRideDto = void 0;
class CancelFutureRideDto {
    constructor(riderId, requestGroupId) {
        this.riderId = riderId;
        this.requestGroupId = requestGroupId;
    }
    static fromRequest(riderId, requestBody) {
        const body = (requestBody ?? {});
        return new CancelFutureRideDto(riderId, body.requestGroupId);
    }
    getRiderId() {
        return this.riderId;
    }
    validate() {
        if (!this.requestGroupId || this.requestGroupId.trim().length === 0) {
            throw new Error("requestGroupId is required");
        }
        if (!this.riderId || this.riderId.trim().length === 0) {
            throw new Error("riderId is required");
        }
    }
}
exports.CancelFutureRideDto = CancelFutureRideDto;
//# sourceMappingURL=CancelFutureRideDto.js.map