import { IAdminDriverRepository } from "../../../domain/repositories/IAdminDriverRepository";
import { GetDriversRequestDto } from "../../dto/admin/GetDriversRequestDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { GetDriversResponseDto } from "../../dto/admin/GetDriversResponseDto";
export declare class GetDriversUseCase implements IUseCase<GetDriversRequestDto, Promise<Result<GetDriversResponseDto>>> {
    private adminDriverRepository;
    constructor(adminDriverRepository: IAdminDriverRepository);
    execute(dto: GetDriversRequestDto): Promise<Result<GetDriversResponseDto>>;
}
//# sourceMappingURL=GetDriversUseCase.d.ts.map