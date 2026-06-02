import { IUseCase } from "../interfaces/IUseCase";
import { LoginRequestDto } from "../../dto/auth/LoginRequestDto";
import { LoginResponseDto } from "../../dto/auth/LoginResponseDto";
import { Result } from "@shared/utils/Result";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordService } from "@application/services/IPasswordService";
import { ITokenManagementService } from "@application/services/ITokenManagementService";
export declare class LoginUseCase implements IUseCase<LoginRequestDto, Promise<Result<LoginResponseDto, Error>>> {
    private userRepository;
    private passwordService;
    private tokenManagementService;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, tokenManagementService: ITokenManagementService);
    execute(dto: LoginRequestDto): Promise<Result<LoginResponseDto, Error>>;
    private validateUser;
}
//# sourceMappingURL=LoginUseCase.d.ts.map