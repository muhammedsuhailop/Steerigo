import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { RemoveCouponDto } from "../../dto/user/RemoveCouponDto";
import { RemoveCouponResponseDto } from "../../dto/user/RemoveCouponResponseDto";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IEventBus } from "../../services/IEventBus";
export declare class RemoveCouponUseCase implements IUseCase<RemoveCouponDto, Promise<Result<RemoveCouponResponseDto>>> {
    private readonly rideRepository;
    private readonly driverRepository;
    private readonly eventBus;
    constructor(rideRepository: IRideRepository, driverRepository: IDriverRepository, eventBus: IEventBus);
    execute(dto: RemoveCouponDto): Promise<Result<RemoveCouponResponseDto>>;
}
//# sourceMappingURL=RemoveCouponUseCase.d.ts.map