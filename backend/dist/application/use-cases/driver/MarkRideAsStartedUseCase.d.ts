import { IUseCase } from "../interfaces/IUseCase";
import { MarkRideAsStartedDto } from "@application/dto/driver/MarkRideAsStartedDto";
import { MarkRideAsStartedResponseDto } from "@application/dto/driver/MarkRideAsStartedResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IEventBus } from "@application/services/IEventBus";
import { Result } from "@shared/utils/Result";
export declare class MarkRideAsStartedUseCase implements IUseCase<MarkRideAsStartedDto, Promise<Result<MarkRideAsStartedResponseDto>>> {
    private driverRepository;
    private rideRepository;
    private eventBus;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, eventBus: IEventBus);
    execute(dto: MarkRideAsStartedDto): Promise<Result<MarkRideAsStartedResponseDto>>;
}
//# sourceMappingURL=MarkRideAsStartedUseCase.d.ts.map