export interface RideRequestTimeoutJobData {
    requestGroupId: string;
    requestId: string;
    driverId: string;
    currentIndex: number;
}
export interface RideGroupNotifyNoDriverJobData {
    requestGroupId: string;
}
export interface RideGroupHardExpireJobData {
    requestGroupId: string;
}
export interface IRideSearchQueue {
    scheduleRequestTimeout(data: RideRequestTimeoutJobData): Promise<void>;
    scheduleNoDriverNotification(data: RideGroupNotifyNoDriverJobData): Promise<void>;
    scheduleHardExpire(data: RideGroupHardExpireJobData): Promise<void>;
    cancelRequestTimeout(requestId: string): Promise<void>;
    cancelGroupJobs(requestGroupId: string): Promise<void>;
}
//# sourceMappingURL=IRideSearchQueue.d.ts.map