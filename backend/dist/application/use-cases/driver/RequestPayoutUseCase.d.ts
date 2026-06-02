import { IUseCase } from "../interfaces/IUseCase";
import { RequestPayoutDto } from "@application/dto/driver/RequestPayoutDto";
import { RequestPayoutResponseDto } from "@application/dto/driver/RequestPayoutResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
export declare class RequestPayoutUseCase implements IUseCase<RequestPayoutDto, Promise<Result<RequestPayoutResponseDto>>> {
    private readonly driverRepository;
    private readonly payoutRepository;
    private readonly walletRepository;
    constructor(driverRepository: IDriverRepository, payoutRepository: IPayoutRepository, walletRepository: IWalletRepository);
    execute(dto: RequestPayoutDto): Promise<Result<RequestPayoutResponseDto>>;
}
//# sourceMappingURL=RequestPayoutUseCase.d.ts.map