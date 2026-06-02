import { IAdminDriverRepository } from "@domain/repositories/IAdminDriverRepository";
import { IKYCRepository } from "@domain/repositories/IAdminDriverKYCRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UpdateDriverKycStatusRequestDto } from "@application/dto/admin/UpdateDriverKycStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateDriverKycStatusResponseDto } from "@application/dto/admin/UpdateDriverKycStatusResponseDto";
export declare class UpdateDriverKycStatusUseCase implements IUseCase<UpdateDriverKycStatusRequestDto, Promise<Result<UpdateDriverKycStatusResponseDto>>> {
    private adminDriverRepository;
    private kycRepository;
    private userRepository;
    constructor(adminDriverRepository: IAdminDriverRepository, kycRepository: IKYCRepository, userRepository: IUserRepository);
    execute(dto: UpdateDriverKycStatusRequestDto): Promise<Result<UpdateDriverKycStatusResponseDto>>;
}
//# sourceMappingURL=UpdateDriverKycStatusUseCase.d.ts.map