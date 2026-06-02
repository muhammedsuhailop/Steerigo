import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { DriverCancelRideDto } from "@application/dto/driver/DriverCancelRideDto";
import { DriverCancelRideResponseDto } from "@application/dto/driver/DriverCancelRideResponseDto";
import { ICancellationChargeService } from "@application/services/ICancellationChargeService";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { IEventBus } from "@application/services/IEventBus";
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