import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IKYCRepository } from "../../../domain/repositories/IKYCRepository";
import { KYCSubmissionRequestDto } from "../../dto/driver/KYCSubmissionRequestDto";
import { Result } from "../../../shared/utils/Result";
import { SubmitKYCResponseDto } from "../../dto/driver/SubmitKYCResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
export declare class SubmitKYCUseCase implements IUseCase<KYCSubmissionRequestDto, Promise<Result<SubmitKYCResponseDto>>> {
    private driverRepository;
    private kycRepository;
    constructor(driverRepository: IDriverRepository, kycRepository: IKYCRepository);
    execute(dto: KYCSubmissionRequestDto): Promise<Result<SubmitKYCResponseDto>>;
    private createNewLicenseKyc;
    private createNewIdKyc;
}
//# sourceMappingURL=SubmitKYCUseCase.d.ts.map