import { IUseCase } from "../interfaces/IUseCase";
import { VerifyPaymentDto } from "../../dto/payment/VerifyPaymentDto";
import { VerifyPaymentResponseDto } from "../../dto/payment/VerifyPaymentResponseDto";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IPaymentGatewayService } from "../../services/IPaymentGatewayService";
import { IEarningsDistributionService } from "../../services/IEarningsDistributionService";
import { Result } from "../../../shared/utils/Result";
import { IEventBus } from "../../services/IEventBus";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
export declare class VerifyPaymentUseCase implements IUseCase<VerifyPaymentDto, Promise<Result<VerifyPaymentResponseDto>>> {
    private readonly paymentRepository;
    private readonly rideRepository;
    private readonly paymentGatewayService;
    private readonly earningsDistributionService;
    private readonly eventBus;
    private readonly driverRepository;
    constructor(paymentRepository: IPaymentRepository, rideRepository: IRideRepository, paymentGatewayService: IPaymentGatewayService, earningsDistributionService: IEarningsDistributionService, eventBus: IEventBus, driverRepository: IDriverRepository);
    execute(dto: VerifyPaymentDto): Promise<Result<VerifyPaymentResponseDto>>;
}
//# sourceMappingURL=VerifyPaymentUseCase.d.ts.map