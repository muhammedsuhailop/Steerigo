"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCouponDto = void 0;
const CouponDiscountType_1 = require("../../../domain/value-objects/CouponDiscountType");
const CouponErrors_1 = require("../../../domain/errors/CouponErrors");
class EditCouponDto {
    constructor(couponId, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, usagePerUser, validFrom, validTo, isActive) {
        this.couponId = couponId;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.maxDiscount = maxDiscount;
        this.minRideAmount = minRideAmount;
        this.usageLimit = usageLimit;
        this.usagePerUser = usagePerUser;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.isActive = isActive;
    }
    static fromRequest(params, body) {
        const parsed = (body ?? {});
        const resolveDate = (val) => {
            if (val === null)
                return null;
            if (val === undefined)
                return undefined;
            return new Date(val);
        };
        const dto = new EditCouponDto(params.couponId, parsed.discountType, parsed.discountValue, parsed.maxDiscount, parsed.minRideAmount, parsed.usageLimit, parsed.usagePerUser, resolveDate(parsed.validFrom), resolveDate(parsed.validTo), parsed.isActive);
        dto.validate();
        return dto;
    }
    validate() {
        if (!this.couponId || this.couponId.trim().length === 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Coupon ID is required");
        }
        if (this.discountType !== undefined &&
            !Object.values(CouponDiscountType_1.CouponDiscountType).includes(this.discountType)) {
            throw CouponErrors_1.CouponErrors.invalidDiscountType(this.discountType);
        }
        if (this.discountValue !== undefined) {
            if (this.discountValue <= 0) {
                throw CouponErrors_1.CouponErrors.invalidDiscountValue("Discount value must be greater than 0");
            }
            if (this.discountType === CouponDiscountType_1.CouponDiscountType.PERCENTAGE &&
                this.discountValue > 100) {
                throw CouponErrors_1.CouponErrors.invalidDiscountValue("Percentage discount cannot exceed 100");
            }
        }
        if (this.maxDiscount !== undefined &&
            this.maxDiscount !== null &&
            this.maxDiscount <= 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Max discount must be greater than 0");
        }
        if (this.minRideAmount !== undefined &&
            this.minRideAmount !== null &&
            this.minRideAmount < 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Min ride amount must be greater than 0");
        }
        if (this.usageLimit !== undefined &&
            this.usageLimit !== null &&
            this.usageLimit < 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Usage limit must be greater than 0");
        }
        if (this.usagePerUser !== undefined &&
            this.usagePerUser !== null &&
            this.usagePerUser <= 0) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("Usage per user must be a positive value");
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
exports.EditCouponDto = EditCouponDto;
//# sourceMappingURL=EditCouponDto.js.map