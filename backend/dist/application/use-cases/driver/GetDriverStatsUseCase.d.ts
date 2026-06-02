import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IRatingRepository } from "../../../domain/repositories/IRatingRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { GetDriverStatsRequestDto } from "../../dto/driver/GetDriverStatsRequestDto";
import { GetDriverStatsResponseDto } from "../../dto/driver/GetDriverStatsResponseDto";
export declare class GetDriverStatsUseCase implements IUseCase<GetDriverStatsRequestDto, Promise<Result<GetDriverStatsResponseDto>>> {
    private readonly rideRepository;
    private readonly ratingRepository;
    private readonly driverRepository;
    constructor(rideRepository: IRideRepository, ratingRepository: IRatingRepository, driverRepository: IDriverRepository);
    execute(dto: GetDriverStatsRequestDto): Promise<Result<GetDriverStatsResponseDto>>;
}
//# sourceMappingURL=GetDriverStatsUseCase.d.ts.map