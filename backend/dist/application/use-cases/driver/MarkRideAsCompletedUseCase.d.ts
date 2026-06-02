import { IUseCase } from "../interfaces/IUseCase";
import { MarkRideAsCompletedDto } from "@application/dto/driver/MarkRideAsCompletedDto";
import { MarkRideAsCompletedResponseDto } from "@application/dto/driver/MarkRideAsCompletedResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { IEventBus } from "@application/services/IEventBus";
import { Result } from "@shared/utils/Result";
import { ICouponValidationService } from "@application/services/ICouponValidationService";
export declare class MarkRideAsCompletedUseCase implements IUseCase<MarkRideAsCompletedDto, Promise<Result<MarkRideAsCompletedResponseDto>>> {
    private driverRepository;
    private rideRepository;
    private fareCalculationService;
    private eventBus;
    private couponValidationService;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, fareCalculationService: IFareCalculationService, eventBus: IEventBus, couponValidationService: ICouponValidationService);
    execute(dto: MarkRideAsCompletedDto): Promise<Result<MarkRideAsCompletedResponseDto>>;
}
//# sourceMappingURL=MarkRideAsCompletedUseCase.d.ts.map