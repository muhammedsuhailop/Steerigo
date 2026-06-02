import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { DriverProfileUpdateDto } from "../../dto/driver/DriverProfileUpdateDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateDriverProfileResponseDto } from "../../dto/driver/UpdateDriverProfileResponseDto";
export declare class UpdateDriverProfileUseCase implements IUseCase<DriverProfileUpdateDto, Promise<Result<UpdateDriverProfileResponseDto>>> {
    private driverRepository;
    private userRepository;
    constructor(driverRepository: IDriverRepository, userRepository: IUserRepository);
    execute(dto: DriverProfileUpdateDto): Promise<Result<UpdateDriverProfileResponseDto>>;
}
//# sourceMappingURL=UpdateDriverProfileUseCase.d.ts.map