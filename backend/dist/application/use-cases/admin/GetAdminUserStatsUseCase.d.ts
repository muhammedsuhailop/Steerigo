import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetUserStatsRequestDto } from "../../dto/admin/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "../../dto/admin/GetUserStatsResponseDto";
export declare class GetAdminUserStatsUseCase implements IUseCase<GetUserStatsRequestDto, Promise<Result<GetUserStatsResponseDto>>> {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: GetUserStatsRequestDto): Promise<Result<GetUserStatsResponseDto>>;
}
//# sourceMappingURL=GetAdminUserStatsUseCase.d.ts.map