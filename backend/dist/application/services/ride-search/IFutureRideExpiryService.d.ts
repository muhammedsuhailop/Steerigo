export interface IFutureRideExpiryService {
    scheduleGroupExpiry(requestGroupId: string): Promise<void>;
    cancelGroupExpiry(requestGroupId: string): Promise<void>;
}
//# sourceMappingURL=IFutureRideExpiryService.d.ts.map