import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { ITokenService } from "@application/services/ITokenService";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class RefreshTokenUseCase implements IUseCase<RefreshTokenDto, Promise<Result<{
    accessToken: string;
    refreshToken: string;
}, Error>>> {
    private refreshTokenRepository;
    private userRepository;
    private tokenService;
    constructor(refreshTokenRepository: IRefreshTokenRepository, userRepository: IUserRepository, tokenService: ITokenService);
    execute(dto: RefreshTokenDto): Promise<Result<{
        accessToken: string;
        refreshToken: string;
    }, Error>>;
}
//# sourceMappingURL=RefreshTokenUseCase.d.ts.map