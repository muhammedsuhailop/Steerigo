import { UserRole } from "@shared/constants/AuthConstants";

export interface TokenPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenService {
  generateAccessToken(payload: { userId: string; role: UserRole }): string;
  generateRefreshToken(): string;
  verifyAccessToken(token: string): TokenPayload | null;
  verifyRefreshToken(token: string): boolean;
  getTokenExpiration(token: string): Date | null;
  generateTokenPair(payload: { userId: string; role: UserRole }): TokenPair;
}
