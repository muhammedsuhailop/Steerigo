import { RideGroupHardExpireJobData, RideGroupNotifyNoDriverJobData, RideRequestTimeoutJobData } from "./RideSearchQueue";
import { IRideSearchQueue } from "@application/services/IRideSearchQueue";
export declare class BullMqRideSearchQueue implements IRideSearchQueue {
    scheduleRequestTimeout(data: RideRequestTimeoutJobData): Promise<void>;
    scheduleNoDriverNotification(data: RideGroupNotifyNoDriverJobData): Promise<void>;
    scheduleHardExpire(data: RideGroupHardExpireJobData): Promise<void>;
    cancelRequestTimeout(requestId: string): Promise<void>;
    cancelGroupJobs(requestGroupId: string): Promise<void>;
}
//# sourceMappingURL=BullMqRideSearchQueue.d.ts.map