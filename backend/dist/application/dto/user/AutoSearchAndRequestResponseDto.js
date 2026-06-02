"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSearchAndRequestResponseDto = void 0;
class AutoSearchAndRequestResponseDto {
    constructor(result, message) {
        this.result = result;
        this.message = message;
    }
    static create(requestGroupId, successfulRequests, failedRequests, totalDriversFound) {
        const successCount = successfulRequests.length;
        const failureCount = failedRequests.length;
        const result = {
            requestGroupId,
            successfulRequests,
            failedRequests,
            totalDriversFound,
            successCount,
            failureCount,
            searchedAt: new Date(),
        };
        let message;
        if (successCount > 0 && failureCount === 0) {
            message = `Successfully sent ${successCount} ride requests`;
        }
        else if (successCount > 0) {
            message = `Sent ${successCount} ride requests (${failureCount} failed)`;
        }
        else if (failureCount > 0) {
            message = `Failed to send all ride requests. ${failureCount} drivers were unavailable`;
        }
        else {
            message = "No drivers found matching your criteria";
        }
        return new AutoSearchAndRequestResponseDto(result, message);
    }
}
exports.AutoSearchAndRequestResponseDto = AutoSearchAndRequestResponseDto;
//# sourceMappingURL=AutoSearchAndRequestResponseDto.js.map