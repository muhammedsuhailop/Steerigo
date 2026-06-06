import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { Result } from "../../../shared/utils/Result";
import { CashPaymentInitData } from "../../../application/dto/payment/InitiatePaymentResponseDto";
import { IPaymentStrategy, PaymentStrategyParams } from "../../../application/services/payment/IPaymentStrategy";
import { PaymentMethod } from "../../../domain/value-objects/PaymentMethod";
export declare class CashPaymentStrategy implements IPaymentStrategy<CashPaymentInitData> {
    private readonly paymentRepository;
    private readonly rideRepository;
    constructor(paymentRepository: IPaymentRepository, rideRepository: IRideRepository);
    getMethod(): PaymentMethod;
    getSuccessMessage(): string;
    execute({ payment, ride, }: PaymentStrategyParams): Promise<Result<CashPaymentInitData>>;
}
//# sourceMappingURL=CashPaymentStrategy.d.ts.map