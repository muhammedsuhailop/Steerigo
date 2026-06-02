import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverPayoutsDto } from "../../dto/driver/GetDriverPayoutsDto";
import { GetPayoutsResponseDto } from "../../dto/driver/GetPayoutsResponseDto";
import { IPayoutRepository } from "../../../domain/repositories/IPayoutRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
export declare class GetDriverPayoutsUseCase implements IUseCase<GetDriverPayoutsDto, Promise<Result<GetPayoutsResponseDto>>> {
    private readonly driverRepository;
    private readonly payoutRepository;
    constructor(driverRepository: IDriverRepository, payoutRepository: IPayoutRepository);
    execute(dto: GetDriverPayoutsDto): Promise<Result<GetPayoutsResponseDto>>;
    private toPayoutItemDto;
}
//# sourceMappingURL=GetDriverPayoutsUseCase.d.ts.map