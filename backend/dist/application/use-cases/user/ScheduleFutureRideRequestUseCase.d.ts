import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { ScheduleFutureRideDto } from "../../dto/user/ScheduleFutureRideDto";
import { ScheduleFutureRideResponseDto } from "../../dto/user/ScheduleFutureRideResponseDto";
import { IFutureRideRequestRepository } from "../../../domain/repositories/IFutureRideRequestRepository";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { IFareCalculationService } from "../../services/IFareCalculationService";
import { IFutureRideExpiryService } from "../../services/ride-search/IFutureRideExpiryService";
import { IEventBus } from "../../services/IEventBus";
export declare class ScheduleFutureRideRequestUseCase implements IUseCase<ScheduleFutureRideDto, Promise<Result<ScheduleFutureRideResponseDto>>> {
    private readonly futureRideRequestRepository;
    private readonly driverAvailabilityRepository;
    private readonly fareCalculationService;
    private readonly futureRideExpiryService;
    private readonly eventBus;
    constructor(futureRideRequestRepository: IFutureRideRequestRepository, driverAvailabilityRepository: IDriverAvailabilityRepository, fareCalculationService: IFareCalculationService, futureRideExpiryService: IFutureRideExpiryService, eventBus: IEventBus);
    execute(dto: ScheduleFutureRideDto): Promise<Result<ScheduleFutureRideResponseDto>>;
}
//# sourceMappingURL=ScheduleFutureRideRequestUseCase.d.ts.map