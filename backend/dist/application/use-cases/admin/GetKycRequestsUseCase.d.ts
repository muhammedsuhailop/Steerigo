import { IKYCRepository } from "@domain/repositories/IAdminDriverKYCRepository";
import { GetKycRequestsRequestDto } from "@application/dto/admin/GetKycRequestsRequestDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { GetKycRequestsResponseDto } from "@application/dto/admin/GetKycRequestsResponseDto";
export declare class GetKycRequestsUseCase implements IUseCase<GetKycRequestsRequestDto, Promise<Result<GetKycRequestsResponseDto>>> {
    private kycRepository;
    constructor(kycRepository: IKYCRepository);
    execute(dto: GetKycRequestsRequestDto): Promise<Result<GetKycRequestsResponseDto>>;
}
//# sourceMappingURL=GetKycRequestsUseCase.d.ts.map