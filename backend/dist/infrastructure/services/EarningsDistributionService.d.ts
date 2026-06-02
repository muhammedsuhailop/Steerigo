import { IEarningsDistributionService, DistributeEarningsParams, EarningsDistributionResult, DistributeCancellationParams } from "../../application/services/IEarningsDistributionService";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { IIdGenerator } from "../../application/services/IIdGenerator";
export declare class EarningsDistributionService implements IEarningsDistributionService {
    private readonly walletRepository;
    private readonly transactionRepository;
    private readonly idGenerator;
    constructor(walletRepository: IWalletRepository, transactionRepository: ITransactionRepository, idGenerator: IIdGenerator);
    distribute(params: DistributeEarningsParams): Promise<EarningsDistributionResult>;
    distributeCashPayment(params: DistributeEarningsParams): Promise<void>;
    distributeCancellation(params: DistributeCancellationParams): Promise<void>;
    private debitWallet;
    private creditDriverWallet;
    private creditPlatformWallet;
    private recordAuditOnlyTransaction;
}
//# sourceMappingURL=EarningsDistributionService.d.ts.map