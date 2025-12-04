import { RefreshToken } from "@domain/entities/RefreshToken";
import { IBaseRepository } from "./IBaseRepository";

export interface IRefreshTokenRepository
  extends IBaseRepository<RefreshToken, string> {
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}
