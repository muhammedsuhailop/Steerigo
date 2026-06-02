import { RideGroupHardExpireJobData, RideGroupNotifyNoDriverJobData, RideRequestTimeoutJobData } from "./RideSearchQueue";
export declare class RideSearchQueueProducer {
    scheduleRequestTimeout(data: RideRequestTimeoutJobData): Promise<void>;
    scheduleNoDriverNotification(data: RideGroupNotifyNoDriverJobData): Promise<void>;
    scheduleHardExpire(data: RideGroupHardExpireJobData): Promise<void>;
    cancelRequestTimeout(requestId: string): Promise<void>;
    cancelGroupJobs(requestGroupId: string): Promise<void>;
}
//# sourceMappingURL=RideSearchQueueProducer.d.ts.map