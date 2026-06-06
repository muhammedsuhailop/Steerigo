import { IKYCRepository } from "../../../domain/repositories/IAdminDriverKYCRepository";
import { GetKycRequestByIdRequestDto } from "../../dto/admin/GetKycRequestByIdRequestDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { GetKycRequestByIdResponseDto } from "../../dto/admin/GetKycRequestByIdResponseDto";
export declare class GetKycRequestByIdUseCase implements IUseCase<GetKycRequestByIdRequestDto, Promise<Result<GetKycRequestByIdResponseDto>>> {
    private kycRepository;
    constructor(kycRepository: IKYCRepository);
    execute(dto: GetKycRequestByIdRequestDto): Promise<Result<GetKycRequestByIdResponseDto>>;
}
//# sourceMappingURL=GetKycRequestByIdUseCase.d.ts.map