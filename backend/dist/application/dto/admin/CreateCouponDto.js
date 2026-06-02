"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCouponDto = void 0;
const CouponDiscountType_1 = require("@domain/value-objects/CouponDiscountType");
const CouponErrors_1 = require("@domain/errors/CouponErrors");
class CreateCouponDto {
    constructor(code, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, usagePerUser, validFrom, validTo) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.maxDiscount = maxDiscount;
        this.minRideAmount = minRideAmount;
        this.usageLimit = usageLimit;
        this.usagePerUser = usagePerUser;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }
    static fromRequest(body) {
        const parsed = (body ?? {});
        const dto = new CreateCouponDto((parsed.code ?? "").trim().toUpperCase(), parsed.discountType, parsed.discountValue, parsed.maxDiscount, parsed.minRideAmount, parsed.usageLimit, parsed.usagePerUser, parsed.validFrom ? new Date(parsed.validFrom) : undefined, parsed.validTo ? new Date(parsed.validTo) : undefined);
        dto.validate();
        return dto;
    }
    validate() {
        if (!this.code || this.code.trim().length === 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Coupon code is required");
        }
        if (!Object.values(CouponDiscountType_1.CouponDiscountType).includes(this.discountType)) {
            throw CouponErrors_1.CouponErrors.invalidDiscountType(this.discountType ?? "");
        }
        if (this.discountValue === undefined || this.discountValue === null) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Discount value is required");
        }
        if (this.discountValue <= 0) {
            throw CouponErrors_1.CouponErrors.invalidDiscountValue("Discount value must be greater than 0");
        }
        if (this.discountType === CouponDiscountType_1.CouponDiscountType.PERCENTAGE &&
            this.discountValue > 100) {
            throw CouponErrors_1.CouponErrors.invalidDiscountValue("Percentage discount cannot exceed 100");
        }
        if (this.maxDiscount !== undefined && this.maxDiscount < 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Max discount must be a positive value");
        }
        if (this.minRideAmount !== undefined && this.minRideAmount < 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Min ride amount must be a positive value");
        }
        if (this.usageLimit !== undefined && this.usageLimit < 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Usage limit must be a positive value");
        }
        if (this.usagePerUser !== undefined && this.usagePerUser <= 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Usage per user must be greater than 0");
        }
        if (this.validFrom && isNaN(this.validFrom.getTime())) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("validFrom is not a valid date");
        }
        if (this.validTo && isNaN(this.validTo.getTime())) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("validTo is not a valid date");
        }
        if (this.validFrom && this.validTo && this.validFrom >= this.validTo) {
            throw CouponErrors_1.CouponErrors.invalidValidityPeriod();
        }
    }
}
exports.CreateCouponDto = CreateCouponDto;
//# sourceMappingURL=CreateCouponDto.js.map