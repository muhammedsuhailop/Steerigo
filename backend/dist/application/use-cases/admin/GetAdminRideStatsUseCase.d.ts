import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IRatingRepository } from "../../../domain/repositories/IRatingRepository";
import { GetAdminRideStatsResponseDto } from "../../dto/admin/GetAdminRideStatsResponseDto";
import { GetAdminRideStatsRequestDto } from "../../dto/admin/GetAdminRideStatsRequestDto";
export declare class GetAdminRideStatsUseCase implements IUseCase<GetAdminRideStatsRequestDto, Promise<Result<GetAdminRideStatsResponseDto>>> {
    private readonly rideRepository;
    private readonly ratingRepository;
    constructor(rideRepository: IRideRepository, ratingRepository: IRatingRepository);
    execute(dto: GetAdminRideStatsRequestDto): Promise<Result<GetAdminRideStatsResponseDto>>;
}
//# sourceMappingURL=GetAdminRideStatsUseCase.d.ts.map