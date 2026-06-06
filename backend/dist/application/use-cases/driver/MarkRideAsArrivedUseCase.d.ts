import { IUseCase } from "../interfaces/IUseCase";
import { MarkRideAsArrivedDto } from "../../dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "../../dto/driver/MarkRideAsArrivedResponseDto";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IEventBus } from "../../services/IEventBus";
import { Result } from "../../../shared/utils/Result";
export declare class MarkRideAsArrivedUseCase implements IUseCase<MarkRideAsArrivedDto, Promise<Result<MarkRideAsArrivedResponseDto>>> {
    private driverRepository;
    private rideRepository;
    private eventBus;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, eventBus: IEventBus);
    execute(dto: MarkRideAsArrivedDto): Promise<Result<MarkRideAsArrivedResponseDto>>;
}
//# sourceMappingURL=MarkRideAsArrivedUseCase.d.ts.map