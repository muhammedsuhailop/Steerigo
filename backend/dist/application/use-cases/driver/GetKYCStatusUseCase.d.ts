import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IKYCRepository } from "../../../domain/repositories/IKYCRepository";
import { KYCResponseDto } from "../../dto/driver/KYCResponseDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetKYCStatusUseCase implements IUseCase<string, Promise<Result<KYCResponseDto[]>>> {
    private driverRepository;
    private kycRepository;
    constructor(driverRepository: IDriverRepository, kycRepository: IKYCRepository);
    execute(userId: string): Promise<Result<KYCResponseDto[]>>;
}
//# sourceMappingURL=GetKYCStatusUseCase.d.ts.map