import { FindNearbyDriversRequestDto } from "@application/dto/user/FindNearbyDriversRequestDto";
import { FindNearbyDriversResponseDto } from "@application/dto/user/FindNearbyDriversResponseDto";
import { Result } from "@shared/utils/Result";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IUseCase } from "../interfaces/IUseCase";
import { IAvailabilityCheckService } from "@application/services/IAvailabilityCheckService";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
export declare class FindNearbyDriversUseCase implements IUseCase<FindNearbyDriversRequestDto, Promise<Result<FindNearbyDriversResponseDto>>> {
    private driverAvailabilityRepository;
    private driverRepository;
    private userRepository;
    private fareCalculationService;
    private availabilityCheckService;
    constructor(driverAvailabilityRepository: IDriverAvailabilityRepository, driverRepository: IDriverRepository, userRepository: IUserRepository, fareCalculationService: IFareCalculationService, availabilityCheckService: IAvailabilityCheckService);
    execute(requestDto: FindNearbyDriversRequestDto): Promise<Result<FindNearbyDriversResponseDto>>;
}
//# sourceMappingURL=FindNearbyDriversUseCase.d.ts.map