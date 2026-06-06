"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleFutureRideResponseDto = void 0;
class ScheduleFutureRideResponseDto {
    constructor(result, message) {
        this.result = result;
        this.message = message;
    }
    static create(requestGroupId, scheduledRequests, pickupTime, expiryWindowMs) {
        const now = new Date();
        const result = {
            requestGroupId,
            scheduledRequests,
            totalDriversNotified: scheduledRequests.length,
            pickupTime,
            expiresAt: new Date(now.getTime() + expiryWindowMs),
            scheduledAt: now,
        };
        const message = scheduledRequests.length > 0
            ? `Your ride has been scheduled. ${scheduledRequests.length} drivers have been notified.`
            : "No drivers found near your pickup area for the scheduled time.";
        return new ScheduleFutureRideResponseDto(result, message);
    }
}
exports.ScheduleFutureRideResponseDto = ScheduleFutureRideResponseDto;
//# sourceMappingURL=ScheduleFutureRideResponseDto.js.map