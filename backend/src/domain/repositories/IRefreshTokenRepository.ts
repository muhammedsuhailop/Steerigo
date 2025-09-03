import { RefreshToken } from "@domain/entities/RefreshToken";

export interface IRefreshTokenRepository {
    findByToken(token: string): Promise<RefreshToken | null>,
    findByUserId(userId: string): Promise<RefreshToken[]>,
    save(refreshToken: RefreshToken): Promise<void>;
    deleteByToken(token: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    deleteExpiredTokens(): Promise<void>;
}