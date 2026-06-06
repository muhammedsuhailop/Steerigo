import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { GetAdminDriverStatsRequestDto } from "../../dto/admin/GetAdminDriverStatsRequestDto";
import { GetAdminDriverStatsResponseDto } from "../../dto/admin/GetAdminDriverStatsResponseDto";
export declare class GetAdminDriverStatsUseCase implements IUseCase<GetAdminDriverStatsRequestDto, Promise<Result<GetAdminDriverStatsResponseDto>>> {
    private readonly driverRepository;
    constructor(driverRepository: IDriverRepository);
    execute(dto: GetAdminDriverStatsRequestDto): Promise<Result<GetAdminDriverStatsResponseDto>>;
}
//# sourceMappingURL=GetAdminDriverStatsUseCase.d.ts.map