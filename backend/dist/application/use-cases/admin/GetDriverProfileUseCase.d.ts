import { IAdminDriverRepository } from "@domain/repositories/IAdminDriverRepository";
import { IKYCRepository } from "@domain/repositories/IAdminDriverKYCRepository";
import { GetDriverProfileRequestDto } from "@application/dto/admin/GetDriverProfileRequestDto";
import { AdminGetDriverProfileResponseDto } from "@application/dto/admin/GetDriverProfileResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetDriverProfileUseCase implements IUseCase<GetDriverProfileRequestDto, Promise<Result<AdminGetDriverProfileResponseDto>>> {
    private adminDriverRepository;
    private kycRepository;
    constructor(adminDriverRepository: IAdminDriverRepository, kycRepository: IKYCRepository);
    execute(dto: GetDriverProfileRequestDto): Promise<Result<AdminGetDriverProfileResponseDto>>;
}
//# sourceMappingURL=GetDriverProfileUseCase.d.ts.map