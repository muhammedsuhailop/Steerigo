import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordService } from "@application/services/IPasswordService";
import { IEmailService } from "@application/services/IEmailService";
import { IOtpService } from "@application/services/IOtpService";
import { ForgotPasswordRequestDto } from "../../dto/auth/ForgotPasswordRequestDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class ForgotPasswordRequestUseCase implements IUseCase<ForgotPasswordRequestDto, Promise<Result<void>>> {
    private userRepository;
    private passwordService;
    private emailService;
    private otpService;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, emailService: IEmailService, otpService: IOtpService);
    execute(dto: ForgotPasswordRequestDto): Promise<Result<void>>;
}
//# sourceMappingURL=ForgotPasswordRequestUseCase.d.ts.map