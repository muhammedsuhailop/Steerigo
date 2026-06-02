import { IUseCase } from "../interfaces/IUseCase";
import { GetAdminPayoutsDto } from "@application/dto/admin/GetAdminPayoutsDto";
import { GetPayoutsResponseDto } from "@application/dto/admin/GetPayoutsResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { Result } from "@shared/utils/Result";
export declare class GetAdminPayoutsUseCase implements IUseCase<GetAdminPayoutsDto, Promise<Result<GetPayoutsResponseDto>>> {
    private readonly payoutRepository;
    constructor(payoutRepository: IPayoutRepository);
    execute(dto: GetAdminPayoutsDto): Promise<Result<GetPayoutsResponseDto>>;
    private toPayoutItemDto;
}
//# sourceMappingURL=GetAdminPayoutsUseCase.d.ts.map