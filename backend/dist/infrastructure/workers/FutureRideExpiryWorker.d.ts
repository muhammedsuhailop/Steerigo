import { IFutureRideRequestRepository } from "../../domain/repositories/IFutureRideRequestRepository";
import { IEventBus } from "../../application/services/IEventBus";
export declare class FutureRideExpiryWorker {
    private readonly futureRideRequestRepository;
    private readonly eventBus;
    private worker?;
    constructor(futureRideRequestRepository: IFutureRideRequestRepository, eventBus: IEventBus);
    start(): void;
    close(): Promise<void>;
    private process;
    private handleGroupExpiry;
}
//# sourceMappingURL=FutureRideExpiryWorker.d.ts.map