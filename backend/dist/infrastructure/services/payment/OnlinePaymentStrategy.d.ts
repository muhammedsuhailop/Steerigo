import { IPaymentGatewayService } from "../../../application/services/IPaymentGatewayService";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { Result } from "../../../shared/utils/Result";
import { OnlinePaymentInitData } from "../../../application/dto/payment/InitiatePaymentResponseDto";
import { IPaymentStrategy, PaymentStrategyParams } from "../../../application/services/payment/IPaymentStrategy";
import { PaymentMethod } from "../../../domain/value-objects/PaymentMethod";
export declare class OnlinePaymentStrategy implements IPaymentStrategy<OnlinePaymentInitData> {
    private readonly paymentGatewayService;
    private readonly paymentRepository;
    private readonly rideRepository;
    constructor(paymentGatewayService: IPaymentGatewayService, paymentRepository: IPaymentRepository, rideRepository: IRideRepository);
    getMethod(): PaymentMethod;
    getSuccessMessage(): string;
    execute({ payment, ride, amount, }: PaymentStrategyParams): Promise<Result<OnlinePaymentInitData>>;
}
//# sourceMappingURL=OnlinePaymentStrategy.d.ts.map