"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponMapper = void 0;
const Coupon_1 = require("@domain/entities/Coupon");
class CouponMapper {
    static toDomain(doc) {
        return Coupon_1.Coupon.fromData({
            id: doc._id.toString(),
            code: doc.code,
            discountType: doc.discountType,
            discountValue: doc.discountValue,
            maxDiscount: doc.maxDiscount,
            minRideAmount: doc.minRideAmount,
            usageLimit: doc.usageLimit,
            usagePerUser: doc.usagePerUser,
            validFrom: doc.validFrom,
            validTo: doc.validTo,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        return {
            code: entity.getCode(),
            discountType: entity.getDiscountType(),
            discountValue: entity.getDiscountValue(),
            maxDiscount: entity.getMaxDiscount(),
            minRideAmount: entity.getMinRideAmount(),
            usageLimit: entity.getUsageLimit(),
            usagePerUser: entity.getUsagePerUser(),
            validFrom: entity.getValidFrom(),
            validTo: entity.getValidTo(),
            isActive: entity.getIsActive(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.CouponMapper = CouponMapper;
//# sourceMappingURL=CouponMapper.js.map