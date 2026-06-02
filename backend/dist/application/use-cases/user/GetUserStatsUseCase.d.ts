import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IRatingRepository } from "../../../domain/repositories/IRatingRepository";
import { GetUserStatsRequestDto } from "../../dto/user/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "../../dto/user/GetUserStatsResponseDto";
export declare class GetUserStatsUseCase implements IUseCase<GetUserStatsRequestDto, Promise<Result<GetUserStatsResponseDto>>> {
    private readonly rideRepository;
    private readonly ratingRepository;
    constructor(rideRepository: IRideRepository, ratingRepository: IRatingRepository);
    execute(dto: GetUserStatsRequestDto): Promise<Result<GetUserStatsResponseDto>>;
}
//# sourceMappingURL=GetUserStatsUseCase.d.ts.map