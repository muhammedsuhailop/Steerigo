import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { UpdateBaseLocationRequestDto } from "../../dto/driver/UpdateBaseLocationRequestDto";
import { UpdateDriverBaseLocationResponseDto } from "../../dto/driver/UpdateDriverBaseLocationResponseDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class UpdateDriverBaseLocationUseCase implements IUseCase<UpdateBaseLocationRequestDto, Promise<Result<UpdateDriverBaseLocationResponseDto>>> {
    private availabilityRepository;
    constructor(availabilityRepository: IDriverAvailabilityRepository);
    execute(dto: UpdateBaseLocationRequestDto): Promise<Result<UpdateDriverBaseLocationResponseDto>>;
}
//# sourceMappingURL=UpdateDriverBaseLocationUseCase.d.ts.map