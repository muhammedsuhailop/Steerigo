import { injectable } from "inversify";
import { ICouponUsageRepository } from "@domain/repositories/ICouponUsageRepository";
import { CouponUsage } from "@domain/entities/CouponUsage";
import { CouponUsageModel } from "../models/CouponUsageModel";
import { CouponUsageMapper } from "../mappers/CouponUsageMapper";

@injectable()
export class CouponUsageRepositoryImpl implements ICouponUsageRepository {
  async countByUserAndCoupon(
    userId: string,
    couponId: string,
  ): Promise<number> {
    return await CouponUsageModel.countDocuments({
      userId,
      couponId,
    });
  }

  async create(usage: CouponUsage): Promise<void> {
    const data = CouponUsageMapper.toPersistence(usage);

    await CouponUsageModel.create(data);
  }
}
