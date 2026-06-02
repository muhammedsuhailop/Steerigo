import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { CancelFutureRideDto } from "@application/dto/user/CancelFutureRideDto";
import { CancelFutureRideResponseDto } from "@application/dto/user/CancelFutureRideResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
import { IEventBus } from "@application/services/IEventBus";
export declare class CancelFutureRideRequestUseCase implements IUseCase<CancelFutureRideDto, Promise<Result<CancelFutureRideResponseDto>>> {
    private readonly futureRideRequestRepository;
    private readonly futureRideExpiryService;
    private readonly eventBus;
    constructor(futureRideRequestRepository: IFutureRideRequestRepository, futureRideExpiryService: IFutureRideExpiryService, eventBus: IEventBus);
    execute(dto: CancelFutureRideDto): Promise<Result<CancelFutureRideResponseDto>>;
}
//# sourceMappingURL=CancelFutureRideRequestUseCase.d.ts.map