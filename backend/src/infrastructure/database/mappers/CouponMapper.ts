import { Coupon } from "@domain/entities/Coupon";
import { ICouponDocument } from "../models/CouponModel";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";

export class CouponMapper {
  static toDomain(doc: ICouponDocument): Coupon {
    return Coupon.fromData({
      id: doc._id.toString(),
      code: doc.code,
      discountType: doc.discountType as CouponDiscountType,
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

  static toPersistence(entity: Coupon): Partial<ICouponDocument> {
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
