import { CouponDiscountType } from "./CouponDiscountType";

export interface CouponDetails {
  couponId: string;
  code: string;
  discountAmount: number;
  discountType: CouponDiscountType;
}
