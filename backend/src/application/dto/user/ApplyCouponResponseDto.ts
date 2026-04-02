export interface ApplyCouponResponseDto {
  rideId: string;
  couponCode: string;
  discountType: string;
  originalFare: number;
  discountAmount: number;
  payableAmount: number;
  currency: string;
  message: string;
}
