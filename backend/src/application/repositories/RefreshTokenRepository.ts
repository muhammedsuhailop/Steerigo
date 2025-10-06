import { RefreshToken } from "@domain/entities/RefreshToken";
import { BaseRepository } from "./BaseRepository";

export interface RefreshTokenRepository
  extends BaseRepository<RefreshToken, string> {
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}
