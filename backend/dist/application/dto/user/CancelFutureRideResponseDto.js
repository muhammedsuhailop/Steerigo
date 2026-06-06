"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelFutureRideResponseDto = void 0;
class CancelFutureRideResponseDto {
    constructor(requestGroupId, cancelledCount, cancelledAt) {
        this.requestGroupId = requestGroupId;
        this.cancelledCount = cancelledCount;
        this.cancelledAt = cancelledAt;
    }
    static create(requestGroupId, cancelledCount) {
        return new CancelFutureRideResponseDto(requestGroupId, cancelledCount, new Date());
    }
}
exports.CancelFutureRideResponseDto = CancelFutureRideResponseDto;
//# sourceMappingURL=CancelFutureRideResponseDto.js.map