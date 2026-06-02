import { IUseCase } from "../interfaces/IUseCase";
import { ConfirmCashPaymentDto } from "../../dto/payment/ConfirmCashPaymentDto";
import { ConfirmCashPaymentResponseDto } from "../../dto/payment/ConfirmCashPaymentResponseDto";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IEarningsDistributionService } from "../../services/IEarningsDistributionService";
import { Result } from "../../../shared/utils/Result";
import { IIdGenerator } from "../../services/IIdGenerator";
import { IEventBus } from "../../services/IEventBus";
export declare class ConfirmCashPaymentUseCase implements IUseCase<ConfirmCashPaymentDto, Promise<Result<ConfirmCashPaymentResponseDto>>> {
    private readonly paymentRepository;
    private readonly rideRepository;
    private readonly driverRepository;
    private readonly earningsDistributionService;
    private readonly idGenerator;
    private readonly eventBus;
    constructor(paymentRepository: IPaymentRepository, rideRepository: IRideRepository, driverRepository: IDriverRepository, earningsDistributionService: IEarningsDistributionService, idGenerator: IIdGenerator, eventBus: IEventBus);
    execute(dto: ConfirmCashPaymentDto): Promise<Result<ConfirmCashPaymentResponseDto>>;
}
//# sourceMappingURL=ConfirmCashPaymentUseCase.d.ts.map