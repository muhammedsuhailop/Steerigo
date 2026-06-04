import { UserRole } from "../../shared/constants/AuthConstants";
export interface ITokenPayload {
    userId: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface ITokenService {
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
//# sourceMappingURL=ITokenService.d.ts.map