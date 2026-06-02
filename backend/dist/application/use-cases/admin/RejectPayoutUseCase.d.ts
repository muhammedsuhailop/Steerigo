import { IUseCase } from "../interfaces/IUseCase";
import { RejectPayoutDto } from "@application/dto/admin/RejectPayoutDto";
import { RejectPayoutResponseDto } from "@application/dto/admin/RejectPayoutResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { Result } from "@shared/utils/Result";
export declare class RejectPayoutUseCase implements IUseCase<RejectPayoutDto, Promise<Result<RejectPayoutResponseDto>>> {
    private readonly payoutRepository;
    constructor(payoutRepository: IPayoutRepository);
    execute(dto: RejectPayoutDto): Promise<Result<RejectPayoutResponseDto>>;
}
//# sourceMappingURL=RejectPayoutUseCase.d.ts.map