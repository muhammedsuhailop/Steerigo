"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCouponDto = void 0;
const RideErrors_1 = require("@domain/errors/RideErrors");
class RemoveCouponDto {
    constructor(riderId, rideId) {
        this.riderId = riderId;
        this.rideId = rideId;
    }
    static fromRequest(riderId, params) {
        const dto = new RemoveCouponDto(riderId, params.rideId);
        dto.validate();
        return dto;
    }
    getRiderId() {
        return this.riderId;
    }
    validate() {
        if (!this.riderId || this.riderId.trim().length === 0) {
            throw RideErrors_1.RideErrors.unauthorizedRideAccess(this.rideId ?? "unknown");
        }
        if (!this.rideId || this.rideId.trim().length === 0) {
            throw RideErrors_1.RideErrors.rideNotFound("unknown");
        }
    }
}
exports.RemoveCouponDto = RemoveCouponDto;
//# sourceMappingURL=RemoveCouponDto.js.map