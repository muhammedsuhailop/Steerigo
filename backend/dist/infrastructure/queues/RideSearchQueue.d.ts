import { Queue } from "bullmq";
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
export declare const rideSearchQueue: Queue<any, any, string, any, any, string>;
//# sourceMappingURL=RideSearchQueue.d.ts.map