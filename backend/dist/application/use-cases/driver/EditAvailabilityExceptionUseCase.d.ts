import { IUseCase } from "../interfaces/IUseCase";
import { EditAvailabilityExceptionRequestDto } from "../../dto/driver/EditAvailabilityExceptionRequestDto";
import { EditAvailabilityExceptionResponseDto } from "../../dto/driver/EditAvailabilityExceptionResponseDto";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
export declare class EditAvailabilityExceptionUseCase implements IUseCase<EditAvailabilityExceptionRequestDto, Promise<Result<EditAvailabilityExceptionResponseDto>>> {
    private driverRepository;
    private availabilityRepository;
    constructor(driverRepository: IDriverRepository, availabilityRepository: IDriverAvailabilityRepository);
    execute(dto: EditAvailabilityExceptionRequestDto): Promise<Result<EditAvailabilityExceptionResponseDto>>;
}
//# sourceMappingURL=EditAvailabilityExceptionUseCase.d.ts.map