import { IUseCase } from "../interfaces/IUseCase";
import { InitiatePaymentDto } from "../../dto/payment/InitiatePaymentDto";
import { InitiatePaymentResponseDto, OnlinePaymentInitData, WalletPaymentInitData, CashPaymentInitData } from "../../dto/payment/InitiatePaymentResponseDto";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { Result } from "../../../shared/utils/Result";
import { IEventBus } from "../../services/IEventBus";
import { IPaymentStrategy } from "../../services/payment/IPaymentStrategy";
import { IIdGenerator } from "../../services/IIdGenerator";
export declare class InitiatePaymentUseCase implements IUseCase<InitiatePaymentDto, Promise<Result<InitiatePaymentResponseDto>>> {
    private readonly rideRepository;
    private readonly paymentRepository;
    private readonly eventBus;
    private idGenerator;
    private readonly strategyMap;
    constructor(rideRepository: IRideRepository, paymentRepository: IPaymentRepository, eventBus: IEventBus, idGenerator: IIdGenerator, strategies: IPaymentStrategy<OnlinePaymentInitData | WalletPaymentInitData | CashPaymentInitData>[]);
    execute(dto: InitiatePaymentDto): Promise<Result<InitiatePaymentResponseDto>>;
}
//# sourceMappingURL=InitiatePaymentUseCase.d.ts.map