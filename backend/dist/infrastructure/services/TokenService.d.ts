import { ITokenService, ITokenPayload, ITokenPair } from "@application/services/ITokenService";
import { UserRole } from "@shared/constants/AuthConstants";
export declare class TokenService implements ITokenService {
    private readonly jwtSecret;
    private readonly refreshTokenSecret;
    constructor();
    generateAccessToken(payload: {
        userId: string;
        role: UserRole;
    }): string;
    generateRefreshToken(): string;
    verifyAccessToken(token: string): ITokenPayload | null;
    verifyRefreshToken(token: string): boolean;
    getTokenExpiration(token: string): Date | null;
    generateTokenPair(payload: {
        userId: string;
        role: UserRole;
    }): ITokenPair;
}
//# sourceMappingURL=TokenService.d.ts.map