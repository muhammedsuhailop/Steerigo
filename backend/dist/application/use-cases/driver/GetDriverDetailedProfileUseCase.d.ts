import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IKYCRepository } from "../../../domain/repositories/IKYCRepository";
import { GetDriverProfileRequestDto } from "../../dto/driver/GetDriverProfileRequestDto";
import { GetDriverProfileResponseDto } from "../../dto/driver/GetDriverProfileResponseDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetDriverDetailedProfileUseCase implements IUseCase<GetDriverProfileRequestDto, Promise<Result<GetDriverProfileResponseDto>>> {
    private driverRepository;
    private userRepository;
    private kycRepository;
    constructor(driverRepository: IDriverRepository, userRepository: IUserRepository, kycRepository: IKYCRepository);
    execute(dto: GetDriverProfileRequestDto): Promise<Result<GetDriverProfileResponseDto>>;
    private maskDocumentNumber;
}
//# sourceMappingURL=GetDriverDetailedProfileUseCase.d.ts.map