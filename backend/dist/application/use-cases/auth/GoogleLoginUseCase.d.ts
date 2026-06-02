import { IGoogleAuthService } from "@application/services/IGoogleAuthService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { ITokenService } from "@application/services/ITokenService";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { IEmailService } from "@application/services/IEmailService";
import { GoogleLoginRequestDto } from "../../dto/auth/GoogleLoginRequestDto";
import { SignupVerifyResponseDto } from "../../dto/auth/SignupVerifyResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GoogleLoginUseCase implements IUseCase<GoogleLoginRequestDto, Promise<Result<SignupVerifyResponseDto & {
    isNewUser: boolean;
}>>> {
    private googleAuthService;
    private userRepository;
    private tokenService;
    private refreshTokenRepository;
    private emailService;
    constructor(googleAuthService: IGoogleAuthService, userRepository: IUserRepository, tokenService: ITokenService, refreshTokenRepository: IRefreshTokenRepository, emailService: IEmailService);
    execute(dto: GoogleLoginRequestDto): Promise<Result<SignupVerifyResponseDto & {
        isNewUser: boolean;
    }>>;
}
//# sourceMappingURL=GoogleLoginUseCase.d.ts.map