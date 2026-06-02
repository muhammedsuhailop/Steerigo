"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelRideRequestDto = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
class CancelRideRequestDto {
    constructor(riderId, requestGroupId) {
        this.riderId = riderId;
        this.requestGroupId = requestGroupId;
    }
    static fromRequest(riderId, requestBody) {
        const body = (requestBody ?? {});
        const { requestGroupId } = body;
        const dto = new CancelRideRequestDto(riderId, requestGroupId);
        dto.validate();
        return dto;
    }
    getRiderId() {
        return this.riderId;
    }
    validate() {
        if (!this.riderId || this.riderId.trim().length === 0) {
            throw new DomainError_1.DomainError("Rider ID is required to cancel requests");
        }
        if (!this.requestGroupId || this.requestGroupId.trim().length === 0) {
            throw new DomainError_1.DomainError("Request group ID is required");
        }
    }
}
exports.CancelRideRequestDto = CancelRideRequestDto;
//# sourceMappingURL=CancelRideRequestDto.js.map