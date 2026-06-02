import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { UpdateStatusRequestDto } from "@application/dto/driver/UpdateStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateAvailabilityStatusResponseDto } from "@application/dto/driver/UpdateAvailabilityStatusResponseDto";
export declare class UpdateAvailabilityStatusUseCase implements IUseCase<UpdateStatusRequestDto, Promise<Result<UpdateAvailabilityStatusResponseDto>>> {
    private availabilityRepository;
    constructor(availabilityRepository: IDriverAvailabilityRepository);
    execute(dto: UpdateStatusRequestDto): Promise<Result<UpdateAvailabilityStatusResponseDto>>;
}
//# sourceMappingURL=UpdateAvailabilityStatusUseCase.d.ts.map