import { IUserRepository } from "@domain/repositories/IUserRepository";
import { SignupRequestDto } from "../../dto/auth/SignupRequestDto";
import { Result } from "@shared/utils/Result";
import { IEmailService } from "@application/services/IEmailService";
import { IPasswordService } from "@application/services/IPasswordService";
import { IOtpService } from "@application/services/IOtpService";
import { IUseCase } from "../interfaces/IUseCase";
export declare class SignupRequestUseCase implements IUseCase<SignupRequestDto, Promise<Result<void>>> {
    private userRepository;
    private passwordService;
    private emailService;
    private otpService;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, emailService: IEmailService, otpService: IOtpService);
    execute(dto: SignupRequestDto): Promise<Result<void>>;
}
//# sourceMappingURL=SignupRequestUseCase.d.ts.map