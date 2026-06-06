import { IRideRequestRepository } from "../../domain/repositories/IRideRequestRepository";
import { IRideRequestGroupRepository } from "../../domain/repositories/IRideRequestGroupRepository";
import { IRideSearchDispatchService } from "../../application/services/IRideSearchDispatchService";
import { IEventBus } from "../../application/services/IEventBus";
import { IDistributedLockService } from "../../application/services/IDistributedLockService";
export declare class RideRequestTimeoutWorker {
    private readonly rideRequestRepository;
    private readonly rideRequestGroupRepository;
    private readonly rideSearchDispatchService;
    private readonly eventBus;
    private readonly lockService;
    private worker?;
    constructor(rideRequestRepository: IRideRequestRepository, rideRequestGroupRepository: IRideRequestGroupRepository, rideSearchDispatchService: IRideSearchDispatchService, eventBus: IEventBus, lockService: IDistributedLockService);
    start(): void;
    close(): Promise<void>;
    private process;
    private handleRequestTimeout;
    private handleGroupNotifyNoDriver;
    private handleGroupHardExpire;
}
//# sourceMappingURL=RideRequestTimeoutWorker.d.ts.map