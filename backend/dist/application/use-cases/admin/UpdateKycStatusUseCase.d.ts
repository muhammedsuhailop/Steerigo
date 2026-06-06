import { IAdminDriverRepository } from "../../../domain/repositories/IAdminDriverRepository";
import { IKYCRepository } from "../../../domain/repositories/IAdminDriverKYCRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UpdateKycStatusRequestDto } from "../../dto/admin/UpdateKycStatusRequestDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { KycDocumentResponseDto } from "../../dto/admin/KycDocumentResponseDto";
export declare class UpdateKycStatusUseCase implements IUseCase<UpdateKycStatusRequestDto, Promise<Result<{
    message: string;
    kycDocument: KycDocumentResponseDto;
    driverKycStatusUpdated: boolean;
}>>> {
    private kycRepository;
    private adminDriverRepository;
    private userRepository;
    constructor(kycRepository: IKYCRepository, adminDriverRepository: IAdminDriverRepository, userRepository: IUserRepository);
    execute(dto: UpdateKycStatusRequestDto): Promise<Result<{
        message: string;
        kycDocument: KycDocumentResponseDto;
        driverKycStatusUpdated: boolean;
    }>>;
}
//# sourceMappingURL=UpdateKycStatusUseCase.d.ts.map