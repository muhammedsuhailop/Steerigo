import { IRideSearchDispatchService } from "../../services/IRideSearchDispatchService";
import { IRideRequestGroupRepository } from "../../../domain/repositories/IRideRequestGroupRepository";
import { IRideRequestRepository } from "../../../domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IEventBus } from "../../services/IEventBus";
import { IDistributedLockService } from "../../services/IDistributedLockService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRideSearchQueue } from "../../services/IRideSearchQueue";
export declare class RideSearchDispatchService implements IRideSearchDispatchService {
    private readonly rideRequestGroupRepository;
    private readonly rideRequestRepository;
    private readonly driverRepository;
    private readonly userRepository;
    private readonly eventBus;
    private readonly lockService;
    private readonly rideSearchQueue;
    private readonly DISPATCH_LOCK_TTL_SECONDS;
    constructor(rideRequestGroupRepository: IRideRequestGroupRepository, rideRequestRepository: IRideRequestRepository, driverRepository: IDriverRepository, userRepository: IUserRepository, eventBus: IEventBus, lockService: IDistributedLockService, rideSearchQueue: IRideSearchQueue);
    scheduleGroupGuards(requestGroupId: string): Promise<void>;
    cancelGroupJobs(requestGroupId: string): Promise<void>;
    dispatchNextRequest(requestGroupId: string, currentIndexOverride?: number): Promise<void>;
    publishSearchProgress(payload: {
        requestGroupId: string;
        riderId: string;
        currentIndex: number;
        totalCandidates: number;
        message: string;
        status: "SEARCHING" | "COMPLETED" | "EXPIRED";
    }): Promise<void>;
    private expireGroupAndNotify;
}
//# sourceMappingURL=RideSearchDispatchService.d.ts.map