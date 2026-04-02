export interface ICouponUsageService {
  recordUsage(rideId: string): Promise<void>;
}
