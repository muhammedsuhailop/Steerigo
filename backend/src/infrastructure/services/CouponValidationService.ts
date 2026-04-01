import { injectable, inject } from "inversify";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { CouponErrors } from "@domain/errors/CouponErrors";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  CouponValidationResult,
  ICouponValidationService,
} from "@application/services/ICouponValidationService";
import { ICouponUsageRepository } from "@domain/repositories/ICouponUsageRepository";

@injectable()
export class CouponValidationService implements ICouponValidationService {
  constructor(
    @inject(TYPES.CouponRepository)
    private readonly couponRepository: ICouponRepository,

    @inject(TYPES.CouponUsageRepository)
    private readonly couponUsageRepository: ICouponUsageRepository,
  ) {}

  async validateAndCalculate(
    code: string,
    rideAmount: number,
    userId: string,
    currentDate: Date,
  ): Promise<CouponValidationResult> {
    Logger.info("Validating coupon", { code, rideAmount });

    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon) {
      throw CouponErrors.couponNotFound(code);
    }

    const usageCount = await this.couponUsageRepository.countByUserAndCoupon(
      userId,
      coupon.getId(),
    );

    if (usageCount >= (coupon.getUsagePerUser() ?? Infinity)) {
      throw CouponErrors.couponUsageLimitExceeded(coupon.getCode());
    }

    if (!coupon.isValidNow(currentDate)) {
      throw CouponErrors.couponNotValid(code);
    }

    if (!coupon.isMinimumAmountSatisfied(rideAmount)) {
      throw CouponErrors.minimumAmountNotSatisfied(
        coupon.getMinRideAmount()!,
        rideAmount,
      );
    }

    const discountAmount = coupon.calculateDiscount(rideAmount);

    Logger.info("Coupon validated successfully", {
      code,
      discountAmount,
      discountType: coupon.getDiscountType(),
    });

    return { coupon, discountAmount };
  }
}
