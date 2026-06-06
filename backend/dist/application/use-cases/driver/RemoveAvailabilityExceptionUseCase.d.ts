import { IUseCase } from "../interfaces/IUseCase";
import { RemoveAvailabilityExceptionRequestDto } from "../../dto/driver/RemoveAvailabilityExceptionRequestDto";
import { RemoveAvailabilityExceptionResponseDto } from "../../dto/driver/RemoveAvailabilityExceptionResponseDto";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
export declare class RemoveAvailabilityExceptionUseCase implements IUseCase<RemoveAvailabilityExceptionRequestDto, Promise<Result<RemoveAvailabilityExceptionResponseDto>>> {
    private driverRepository;
    private availabilityRepository;
    constructor(driverRepository: IDriverRepository, availabilityRepository: IDriverAvailabilityRepository);
    execute(dto: RemoveAvailabilityExceptionRequestDto): Promise<Result<RemoveAvailabilityExceptionResponseDto>>;
}
//# sourceMappingURL=RemoveAvailabilityExceptionUseCase.d.ts.map