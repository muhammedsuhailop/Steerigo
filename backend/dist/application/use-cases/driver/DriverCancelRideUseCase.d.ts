import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { DriverCancelRideDto } from "../../dto/driver/DriverCancelRideDto";
import { DriverCancelRideResponseDto } from "../../dto/driver/DriverCancelRideResponseDto";
import { ICancellationChargeService } from "../../services/ICancellationChargeService";
import { IEarningsDistributionService } from "../../services/IEarningsDistributionService";
import { IEventBus } from "../../services/IEventBus";
export declare class DriverCancelRideUseCase implements IUseCase<DriverCancelRideDto, Promise<Result<DriverCancelRideResponseDto>>> {
    private readonly driverRepository;
    private readonly rideRepository;
    private readonly earningsDistributionService;
    private readonly cancellationChargeService;
    private readonly eventBus;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, earningsDistributionService: IEarningsDistributionService, cancellationChargeService: ICancellationChargeService, eventBus: IEventBus);
    execute(dto: DriverCancelRideDto): Promise<Result<DriverCancelRideResponseDto>>;
}
//# sourceMappingURL=DriverCancelRideUseCase.d.ts.map