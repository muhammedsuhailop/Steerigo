import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { IEmailService } from "../../services/IEmailService";
import { IOtpService } from "../../services/IOtpService";
import { ForgotPasswordVerifyDto } from "../../dto/auth/ForgotPasswordVerifyDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class ForgotPasswordVerifyUseCase implements IUseCase<ForgotPasswordVerifyDto, Promise<Result<void>>> {
    private userRepository;
    private passwordService;
    private emailService;
    private otpService;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, emailService: IEmailService, otpService: IOtpService);
    execute(dto: ForgotPasswordVerifyDto): Promise<Result<void>>;
}
//# sourceMappingURL=ForgotPasswordVerifyUseCase.d.ts.map