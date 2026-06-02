import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { Result } from "@shared/utils/Result";
import { WalletPaymentInitData } from "@application/dto/payment/InitiatePaymentResponseDto";
import { IPaymentStrategy, PaymentStrategyParams } from "@application/services/payment/IPaymentStrategy";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
export declare class WalletPaymentStrategy implements IPaymentStrategy<WalletPaymentInitData> {
    private readonly walletRepository;
    private readonly transactionRepository;
    private readonly paymentRepository;
    private readonly rideRepository;
    private readonly earningsService;
    constructor(walletRepository: IWalletRepository, transactionRepository: ITransactionRepository, paymentRepository: IPaymentRepository, rideRepository: IRideRepository, earningsService: IEarningsDistributionService);
    getMethod(): PaymentMethod;
    getSuccessMessage(): string;
    execute({ payment, ride, amount, userId, }: PaymentStrategyParams): Promise<Result<WalletPaymentInitData>>;
}
//# sourceMappingURL=WalletPaymentStrategy.d.ts.map