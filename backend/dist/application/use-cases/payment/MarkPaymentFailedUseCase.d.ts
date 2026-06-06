import { IUseCase } from "../interfaces/IUseCase";
import { MarkPaymentFailedDto } from "../../dto/payment/MarkPaymentFailedDto";
import { MarkPaymentFailedResponseDto } from "../../dto/payment/MarkPaymentFailedResponseDto";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { Result } from "../../../shared/utils/Result";
import { IEventBus } from "../../services/IEventBus";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
export declare class MarkPaymentFailedUseCase implements IUseCase<MarkPaymentFailedDto, Promise<Result<MarkPaymentFailedResponseDto>>> {
    private readonly paymentRepository;
    private readonly rideRepository;
    private readonly eventBus;
    private readonly driverRepository;
    constructor(paymentRepository: IPaymentRepository, rideRepository: IRideRepository, eventBus: IEventBus, driverRepository: IDriverRepository);
    execute(dto: MarkPaymentFailedDto): Promise<Result<MarkPaymentFailedResponseDto>>;
}
//# sourceMappingURL=MarkPaymentFailedUseCase.d.ts.map