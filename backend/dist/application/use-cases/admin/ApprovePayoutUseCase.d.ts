import { IUseCase } from "../interfaces/IUseCase";
import { ApprovePayoutDto } from "@application/dto/admin/ApprovePayoutDto";
import { ApprovePayoutResponseDto } from "@application/dto/admin/ApprovePayoutResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { Result } from "@shared/utils/Result";
export declare class ApprovePayoutUseCase implements IUseCase<ApprovePayoutDto, Promise<Result<ApprovePayoutResponseDto>>> {
    private readonly payoutRepository;
    private readonly walletRepository;
    private readonly transactionRepository;
    constructor(payoutRepository: IPayoutRepository, walletRepository: IWalletRepository, transactionRepository: ITransactionRepository);
    execute(dto: ApprovePayoutDto): Promise<Result<ApprovePayoutResponseDto>>;
}
//# sourceMappingURL=ApprovePayoutUseCase.d.ts.map