import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { ICouponValidationService } from "@application/services/ICouponValidationService";
import { ApplyCouponDto } from "@application/dto/user/ApplyCouponDto";
import { ApplyCouponResponseDto } from "@application/dto/user/ApplyCouponResponseDto";
import { IEventBus } from "@application/services/IEventBus";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
export declare class ApplyCouponUseCase implements IUseCase<ApplyCouponDto, Promise<Result<ApplyCouponResponseDto>>> {
    private readonly rideRepository;
    private readonly couponValidationService;
    private readonly eventBus;
    private readonly driverRepository;
    constructor(rideRepository: IRideRepository, couponValidationService: ICouponValidationService, eventBus: IEventBus, driverRepository: IDriverRepository);
    execute(dto: ApplyCouponDto): Promise<Result<ApplyCouponResponseDto>>;
}
//# sourceMappingURL=ApplyCouponUseCase.d.ts.map