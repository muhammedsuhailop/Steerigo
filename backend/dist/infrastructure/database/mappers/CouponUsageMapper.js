"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsageMapper = void 0;
const mongoose_1 = require("mongoose");
const CouponUsage_1 = require("@domain/entities/CouponUsage");
class CouponUsageMapper {
    static toDomain(doc) {
        return CouponUsage_1.CouponUsage.fromData({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            couponId: doc.couponId.toString(),
            rideId: doc.rideId.toString(),
            discountAmount: doc.discountAmount,
            usedAt: doc.usedAt,
        });
    }
    static toPersistence(entity) {
        return {
            userId: new mongoose_1.Types.ObjectId(entity.getUserId()),
            couponId: new mongoose_1.Types.ObjectId(entity.getCouponId()),
            rideId: entity.getRideId(),
            discountAmount: entity.getdiscountAmount(),
            usedAt: entity.getUsedAt(),
        };
    }
}
exports.CouponUsageMapper = CouponUsageMapper;
//# sourceMappingURL=CouponUsageMapper.js.map