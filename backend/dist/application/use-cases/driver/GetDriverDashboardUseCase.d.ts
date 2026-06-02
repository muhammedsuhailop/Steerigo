import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverDashboardRepository } from "@domain/repositories/IDriverDashboardRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetDriverDashboardUseCase implements IUseCase<GetDriverDashboardDto, Promise<Result<DriverDashboardResponseDto>>> {
    private driverRepository;
    private availabilityRepository;
    private dashboardRepository;
    private userRepository;
    constructor(driverRepository: IDriverRepository, availabilityRepository: IDriverAvailabilityRepository, dashboardRepository: IDriverDashboardRepository, userRepository: IUserRepository);
    execute(dto: GetDriverDashboardDto): Promise<Result<DriverDashboardResponseDto>>;
}
//# sourceMappingURL=GetDriverDashboardUseCase.d.ts.map