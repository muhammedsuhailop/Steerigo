import { IUseCase } from "../interfaces/IUseCase";
import { ScheduleRecurringAvailabilityRequestDto } from "../../dto/driver/ScheduleRecurringAvailabilityRequestDto";
import { DriverAvailabilityResponseDto } from "../../dto/driver/DriverAvailabilityResponseDto";
import { IDriverAvailabilityRepository } from "../../../domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
export declare class ScheduleRecurringAvailabilityUseCase implements IUseCase<ScheduleRecurringAvailabilityRequestDto, Promise<Result<DriverAvailabilityResponseDto>>> {
    private availabilityRepository;
    private driverRepository;
    constructor(availabilityRepository: IDriverAvailabilityRepository, driverRepository: IDriverRepository);
    execute(dto: ScheduleRecurringAvailabilityRequestDto): Promise<Result<DriverAvailabilityResponseDto>>;
    private buildResponseDto;
}
//# sourceMappingURL=ScheduleRecurringAvailabilityUseCase.d.ts.map