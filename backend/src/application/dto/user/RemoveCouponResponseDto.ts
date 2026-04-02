export interface RemoveCouponResponseDto {
  rideId: string;
  originalFare: number;
  payableAmount: number;
  currency: string;
  message: string;
}
