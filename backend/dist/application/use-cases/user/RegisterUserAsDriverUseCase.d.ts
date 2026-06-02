import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { RegisterAsDriverRequestDto } from "@application/dto/user/RegisterAsDriverRequestDto";
import { RegisterAsDriverResponseDto } from "@application/dto/user/RegisterAsDriverResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class RegisterUserAsDriverUseCase implements IUseCase<RegisterAsDriverRequestDto, Promise<Result<RegisterAsDriverResponseDto>>> {
    private userRepository;
    private driverRepository;
    constructor(userRepository: IUserRepository, driverRepository: IDriverRepository);
    execute(dto: RegisterAsDriverRequestDto): Promise<Result<RegisterAsDriverResponseDto>>;
}
//# sourceMappingURL=RegisterUserAsDriverUseCase.d.ts.map