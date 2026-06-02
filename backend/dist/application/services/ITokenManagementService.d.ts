import { RefreshToken } from "../../domain/entities/RefreshToken";
export interface ITokenManagementService {
    generateAccessToken(payload: {
        userId: string;
        role: string;
    }): string;
    generateRefreshToken(): string;
    createRefreshTokenEntity(userId: string, token: string, expiresAt: Date): RefreshToken;
    cleanupUserRefreshTokens(userId: string): Promise<void>;
    saveRefreshToken(refreshToken: RefreshToken): Promise<void>;
}
//# sourceMappingURL=ITokenManagementService.d.ts.map