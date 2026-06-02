import { AutoSearchAndRequestDto } from "../../dto/user/AutoSearchAndRequestDto";
import { AutoSearchAndRequestResponseDto } from "../../dto/user/AutoSearchAndRequestResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IFareCalculationService } from "../../services/IFareCalculationService";
import { IRideRequestGroupRepository } from "../../../domain/repositories/IRideRequestGroupRepository";
import { IRideSearchDispatchService } from "../../services/IRideSearchDispatchService";
export declare class AutoSearchAndSendRideRequestUseCase implements IUseCase<AutoSearchAndRequestDto, Promise<Result<AutoSearchAndRequestResponseDto>>> {
    private readonly driverAvailabilityRepository;
    private readonly userRepository;
    private readonly fareCalculationService;
    private readonly rideRequestGroupRepository;
    private readonly rideSearchDispatchService;
    constructor(driverAvailabilityRepository: IDriverAvailabilityRepository, userRepository: IUserRepository, fareCalculationService: IFareCalculationService, rideRequestGroupRepository: IRideRequestGroupRepository, rideSearchDispatchService: IRideSearchDispatchService);
    execute(dto: AutoSearchAndRequestDto): Promise<Result<AutoSearchAndRequestResponseDto>>;
}
//# sourceMappingURL=AutoSearchAndSendRideRequestUseCase.d.ts.map