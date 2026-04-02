import { Coupon } from "@domain/entities/Coupon";

export interface CouponValidationResult {
  coupon: Coupon;
  discountAmount: number;
}

export interface ICouponValidationService {
  validateAndCalculate(
    code: string,
    rideAmount: number,
    userId: string,
    currentDate: Date,
  ): Promise<CouponValidationResult>;
}
