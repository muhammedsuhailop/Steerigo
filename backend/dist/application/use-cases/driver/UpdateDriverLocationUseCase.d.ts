import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { UpdateLocationRequestDto } from "@application/dto/driver/UpdateLocationRequestDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateDriverLocationResponseDto } from "@application/dto/driver/UpdateDriverLocationResponseDto";
export declare class UpdateDriverLocationUseCase implements IUseCase<UpdateLocationRequestDto, Promise<Result<UpdateDriverLocationResponseDto>>> {
    private availabilityRepository;
    constructor(availabilityRepository: IDriverAvailabilityRepository);
    execute(dto: UpdateLocationRequestDto): Promise<Result<UpdateDriverLocationResponseDto>>;
}
//# sourceMappingURL=UpdateDriverLocationUseCase.d.ts.map