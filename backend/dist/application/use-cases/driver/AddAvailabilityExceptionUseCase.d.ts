import { IUseCase } from "../interfaces/IUseCase";
import { AddAvailabilityExceptionRequestDto } from "../../dto/driver/AddAvailabilityExceptionRequestDto";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
import { AddAvailabilityExceptionResponseDto } from "../../dto/driver/AddAvailabilityExceptionResponseDto";
export declare class AddAvailabilityExceptionUseCase implements IUseCase<AddAvailabilityExceptionRequestDto, Promise<Result<AddAvailabilityExceptionResponseDto>>> {
    private driverRepository;
    private availabilityRepository;
    constructor(driverRepository: IDriverRepository, availabilityRepository: IDriverAvailabilityRepository);
    execute(dto: AddAvailabilityExceptionRequestDto): Promise<Result<AddAvailabilityExceptionResponseDto>>;
}
//# sourceMappingURL=AddAvailabilityExceptionUseCase.d.ts.map