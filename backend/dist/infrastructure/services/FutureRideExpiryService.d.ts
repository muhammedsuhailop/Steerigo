import { Queue } from "bullmq";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
import { FutureRideExpiryJobData } from "@infrastructure/queues/FutureRideExpiryQueue";
export declare class FutureRideExpiryService implements IFutureRideExpiryService {
    private readonly expiryQueue;
    constructor(expiryQueue: Queue<FutureRideExpiryJobData>);
    scheduleGroupExpiry(requestGroupId: string): Promise<void>;
    cancelGroupExpiry(requestGroupId: string): Promise<void>;
    private buildJobId;
}
//# sourceMappingURL=FutureRideExpiryService.d.ts.map