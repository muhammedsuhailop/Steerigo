import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IKYCRepository } from "../../../domain/repositories/IKYCRepository";
import { DriverRegistrationRequestDto } from "../../dto/driver/DriverRegistrationRequestDto";
import { DriverResponseDto } from "../../dto/driver/DriverResponseDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export interface RegisterDriverResult {
    driver: DriverResponseDto;
    kycDocumentsCreated: {
        license: string;
        idDocument: string;
    };
    userUpdated: boolean;
}
export declare class DriverRegistrationUseCase implements IUseCase<DriverRegistrationRequestDto, Promise<Result<RegisterDriverResult>>> {
    private driverRepository;
    private userRepository;
    private kycRepository;
    constructor(driverRepository: IDriverRepository, userRepository: IUserRepository, kycRepository: IKYCRepository);
    execute(dto: DriverRegistrationRequestDto): Promise<Result<RegisterDriverResult>>;
}
//# sourceMappingURL=RegisterDriverUseCase.d.ts.map