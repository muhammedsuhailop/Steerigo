import { Types } from "mongoose";
import { ICouponUsageDocument } from "../models/CouponUsageModel";
import { CouponUsage } from "@domain/entities/CouponUsage";

export class CouponUsageMapper {
  static toDomain(doc: ICouponUsageDocument): CouponUsage {
    return CouponUsage.fromData({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      couponId: doc.couponId.toString(),
      rideId: doc.rideId.toString(),
      discountAmount: doc.discountAmount,
      usedAt: doc.usedAt,
    });
  }

  static toPersistence(entity: CouponUsage) {
    return {
      userId: new Types.ObjectId(entity.getUserId()),
      couponId: new Types.ObjectId(entity.getCouponId()),
      rideId: new Types.ObjectId(entity.getRideId()),
      discountAmount: entity.getdiscountAmount(),
      usedAt: entity.getUsedAt(),
    };
  }
}
