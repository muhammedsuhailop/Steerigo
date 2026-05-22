export interface IFutureRideExpiryService {
  scheduleGroupExpiry(requestGroupId: string): Promise<void>;
  cancelGroupExpiry(requestGroupId: string): Promise<void>;
}
