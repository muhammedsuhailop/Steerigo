import { ITokenManagementService } from "../../application/services/ITokenManagementService";
import { ITokenService } from "../../application/services/ITokenService";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { RefreshToken } from "../../domain/entities/RefreshToken";
import { UserRole } from "../../shared/constants/AuthConstants";
export declare class TokenManagementService implements ITokenManagementService {
    private tokenService;
    private refreshTokenRepository;
    constructor(tokenService: ITokenService, refreshTokenRepository: IRefreshTokenRepository);
    generateAccessToken(payload: {
        userId: string;
        role: UserRole;
    }): string;
    generateRefreshToken(): string;
    createRefreshTokenEntity(userId: string, token: string, expiresAt: Date): RefreshToken;
    cleanupUserRefreshTokens(userId: string): Promise<void>;
    saveRefreshToken(refreshToken: RefreshToken): Promise<void>;
}
//# sourceMappingURL=TokenManagementService.d.ts.map