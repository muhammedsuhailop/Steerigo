import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { DriverStatusResponseDto } from "../../dto/driver/DriverStatusResponseDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetDriverStatusUseCase implements IUseCase<string, Promise<Result<DriverStatusResponseDto>>> {
    private driverRepository;
    private availabilityRepository;
    constructor(driverRepository: IDriverRepository, availabilityRepository: IDriverAvailabilityRepository);
    execute(userId: string): Promise<Result<DriverStatusResponseDto>>;
}
//# sourceMappingURL=GetDriverStatusUseCase.d.ts.map