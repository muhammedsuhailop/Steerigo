import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { CancelRideDto } from "../../dto/user/CancelRideDto";
import { CancelRideResponseDto } from "../../dto/user/CancelRideResponseDto";
import { ICancellationChargeService } from "../../services/ICancellationChargeService";
import { IEventBus } from "../../services/IEventBus";
export declare class CancelRideUseCase implements IUseCase<CancelRideDto, Promise<Result<CancelRideResponseDto>>> {
    private readonly rideRepository;
    private readonly driverRepository;
    private readonly cancellationChargeService;
    private readonly eventBus;
    private static readonly GRACE_PERIOD_MINUTES;
    constructor(rideRepository: IRideRepository, driverRepository: IDriverRepository, cancellationChargeService: ICancellationChargeService, eventBus: IEventBus);
    execute(dto: CancelRideDto): Promise<Result<CancelRideResponseDto>>;
}
//# sourceMappingURL=CancelRideUseCase.d.ts.map