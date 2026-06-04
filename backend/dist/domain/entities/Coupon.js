"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const CouponDiscountType_1 = require("@domain/value-objects/CouponDiscountType");
class Coupon {
    constructor(id, code, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, usagePerUser, validFrom, validTo, isActive, createdAt, updatedAt) {
        this.id = id;
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.maxDiscount = maxDiscount;
        this.minRideAmount = minRideAmount;
        this.usageLimit = usageLimit;
        this.usagePerUser = usagePerUser;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(id, code, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, usagePerUser, validFrom, validTo) {
        if (!id || !code) {
            throw new Error("Coupon ID and code are required");
        }
        if (discountValue <= 0) {
            throw new Error("Discount value must be greater than 0");
        }
        if (validFrom && validTo && validFrom >= validTo) {
            throw new Error("Invalid validity period");
        }
        return new Coupon(id, code.trim().toUpperCase(), discountType, discountValue, maxDiscount, minRideAmount, usageLimit, usagePerUser, validFrom, validTo, true, new Date(), new Date());
    }
    static fromData(data) {
        return new Coupon(data.id, data.code, data.discountType, data.discountValue, data.maxDiscount, data.minRideAmount, data.usageLimit, data.usagePerUser, data.validFrom, data.validTo, data.isActive, data.createdAt, data.updatedAt);
    }
    isValidNow(currentDate) {
        if (!this.isActive)
            return false;
        if (this.validFrom && currentDate < this.validFrom) {
            return false;
        }
        if (this.validTo && currentDate > this.validTo) {
            return false;
        }
        return true;
    }
    isMinimumAmountSatisfied(amount) {
        if (!this.minRideAmount)
            return true;
        return amount >= this.minRideAmount;
    }
    calculateDiscount(amount) {
        if (amount <= 0)
            return 0;
        let discount = 0;
        if (this.discountType === CouponDiscountType_1.CouponDiscountType.FLAT) {
            discount = this.discountValue;
        }
        else {
            discount = (amount * this.discountValue) / 100;
            if (this.maxDiscount !== undefined) {
                discount = Math.min(discount, this.maxDiscount);
            }
        }
        return Math.min(discount, amount);
    }
    activate() {
        if (this.isActive)
            return;
        this.isActive = true;
        this.updatedAt = new Date();
    }
    deactivate() {
        if (!this.isActive)
            return;
        this.isActive = false;
        this.updatedAt = new Date();
    }
    getId() {
        return this.id;
    }
    getCode() {
        return this.code;
    }
    getDiscountType() {
        return this.discountType;
    }
    getDiscountValue() {
        return this.discountValue;
    }
    getMaxDiscount() {
        return this.maxDiscount;
    }
    getMinRideAmount() {
        return this.minRideAmount;
    }
    getUsageLimit() {
        return this.usageLimit;
    }
    getUsagePerUser() {
        return this.usagePerUser;
    }
    getValidFrom() {
        return this.validFrom;
    }
    getValidTo() {
        return this.validTo;
    }
    getIsActive() {
        return this.isActive;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.Coupon = Coupon;
//# sourceMappingURL=Coupon.js.map