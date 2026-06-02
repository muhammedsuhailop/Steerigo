import { IUseCase } from "../interfaces/IUseCase";
import { RejectFutureRideRequestDto } from "@application/dto/driver/RejectFutureRideRequestDto";
import { RejectFutureRideRequestResponseDto } from "@application/dto/driver/RejectFutureRideRequestResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { IEventBus } from "@application/services/IEventBus";
import { Result } from "@shared/utils/Result";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
export declare class RejectFutureRideRequestUseCase implements IUseCase<RejectFutureRideRequestDto, Promise<Result<RejectFutureRideRequestResponseDto>>> {
    private readonly driverRepository;
    private readonly futureRideRequestRepository;
    private readonly lockService;
    private readonly eventBus;
    private readonly futureRideExpiryService;
    private readonly LOCK_TTL_SECONDS;
    private readonly LOCK_KEY_PREFIX;
    constructor(driverRepository: IDriverRepository, futureRideRequestRepository: IFutureRideRequestRepository, lockService: IDistributedLockService, eventBus: IEventBus, futureRideExpiryService: IFutureRideExpiryService);
    execute(dto: RejectFutureRideRequestDto): Promise<Result<RejectFutureRideRequestResponseDto>>;
}
//# sourceMappingURL=RejectFutureRideRequestUseCase.d.ts.map