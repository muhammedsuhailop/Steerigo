import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { IOtpService } from "@application/services/IOtpService";
import { ITokenService } from "@application/services/ITokenService";
import { IEmailService } from "@application/services/IEmailService";
import { SignupVerifyDto } from "../../dto/auth/SignupVerifyDto";
import { SignupVerifyResponseDto } from "../../dto/auth/SignupVerifyResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class SignupVerifyUseCase implements IUseCase<SignupVerifyDto, Promise<Result<SignupVerifyResponseDto>>> {
    private userRepository;
    private refreshTokenRepository;
    private otpService;
    private tokenService;
    private emailService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, otpService: IOtpService, tokenService: ITokenService, emailService: IEmailService);
    execute(dto: SignupVerifyDto): Promise<Result<SignupVerifyResponseDto>>;
}
//# sourceMappingURL=SignupVerifyUseCase.d.ts.map