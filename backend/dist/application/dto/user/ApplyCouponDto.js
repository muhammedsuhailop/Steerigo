"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyCouponDto = void 0;
const RideErrors_1 = require("../../../domain/errors/RideErrors");
const CouponErrors_1 = require("../../../domain/errors/CouponErrors");
class ApplyCouponDto {
    constructor(riderId, rideId, couponCode) {
        this.riderId = riderId;
        this.rideId = rideId;
        this.couponCode = couponCode;
    }
    static fromRequest(riderId, params, body) {
        const parsedBody = (body ?? {});
        const couponCode = parsedBody.couponCode?.trim().toUpperCase() ?? "";
        const dto = new ApplyCouponDto(riderId, params.rideId, couponCode);
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
        if (!this.couponCode || this.couponCode.trim().length === 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Coupon code is required");
        }
    }
}
exports.ApplyCouponDto = ApplyCouponDto;
//# sourceMappingURL=ApplyCouponDto.js.map