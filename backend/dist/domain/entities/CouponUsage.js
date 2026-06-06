"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsage = void 0;
class CouponUsage {
    constructor(id, userId, couponId, rideId, discountAmount, usedAt) {
        this.id = id;
        this.userId = userId;
        this.couponId = couponId;
        this.rideId = rideId;
        this.discountAmount = discountAmount;
        this.usedAt = usedAt;
    }
    static create(params) {
        if (!params.userId || !params.couponId || !params.rideId) {
            throw new Error("Invalid coupon usage data");
        }
        return new CouponUsage(params.id, params.userId, params.couponId, params.rideId, params.discountAmount, params.usedAt ?? new Date());
    }
    static fromData(data) {
        return new CouponUsage(data.id, data.userId, data.couponId, data.rideId, data.discountAmount, data.usedAt);
    }
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getCouponId() {
        return this.couponId;
    }
    getRideId() {
        return this.rideId;
    }
    getUsedAt() {
        return this.usedAt;
    }
    getdiscountAmount() {
        return this.discountAmount;
    }
}
exports.CouponUsage = CouponUsage;
//# sourceMappingURL=CouponUsage.js.map