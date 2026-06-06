import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IRatingRepository } from "../../../domain/repositories/IRatingRepository";
import { GetAdminRatingsDto } from "../../dto/admin/GetAdminRatingsDto";
import { GetAdminRatingsResponseDto } from "../../dto/admin/GetAdminRatingsResponseDto";
export declare class GetAdminRatingsUseCase implements IUseCase<GetAdminRatingsDto, Promise<Result<GetAdminRatingsResponseDto>>> {
    private readonly ratingRepository;
    constructor(ratingRepository: IRatingRepository);
    execute(dto: GetAdminRatingsDto): Promise<Result<GetAdminRatingsResponseDto>>;
}
//# sourceMappingURL=GetAdminRatingsUseCase.d.ts.map