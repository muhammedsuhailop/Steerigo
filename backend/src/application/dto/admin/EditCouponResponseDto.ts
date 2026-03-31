import { CouponData } from "./CreateCouponResponseDto";

export interface EditCouponResponseDto {
  success: boolean;
  message: string;
  data: {
    coupon: CouponData;
  };
}
