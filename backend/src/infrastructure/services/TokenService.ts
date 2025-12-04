import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  ITokenService,
  ITokenPayload,
  ITokenPair,
} from "@application/services/ITokenService";
import { TokenConfig } from "@shared/constants/AuthConstants";
import { UserRole } from "@shared/constants/AuthConstants";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class TokenService implements ITokenService {
  private readonly jwtSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "";
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";

    if (!this.jwtSecret || !this.refreshTokenSecret) {
      throw new Error(
        "JWT_SECRET and REFRESH_TOKEN_SECRET environment variables are required"
      );
    }
  }

  generateAccessToken(payload: { userId: string; role: UserRole }): string {
    try {
      const token = jwt.sign(
        {
          userId: payload.userId,
          role: payload.role,
          type: "access",
        },
        this.jwtSecret,
        {
          expiresIn: TokenConfig.ACCESS_TOKEN_EXPIRES_IN,
          issuer: TokenConfig.JWT_ISSUER,
          audience: TokenConfig.JWT_AUDIENCE,
        }
      );

      Logger.debug("Access token generated successfully", {
        userId: payload.userId,
      });
      return token;
    } catch (error) {
      Logger.error("Error generating access token", error);
      throw new Error("Failed to generate access token");
    }
  }

  generateRefreshToken(): string {
    try {
      const randomBytes = crypto.randomBytes(64);
      const refreshToken = randomBytes.toString("hex");
      Logger.debug("Refresh token generated successfully");
      return refreshToken;
    } catch (error) {
      Logger.error("Error generating refresh token", error);
      throw new Error("Failed to generate refresh token");
    }
  }

  verifyAccessToken(token: string): ITokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: TokenConfig.JWT_ISSUER,
        audience: TokenConfig.JWT_AUDIENCE,
      }) as any;

      // Ensure it's an access token
      if (decoded.type !== "access") {
        Logger.warn("Invalid token type", { type: decoded.type });
        return null;
      }

      Logger.debug("Access token verified successfully", {
        userId: decoded.userId,
      });
      return {
        userId: decoded.userId,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } catch (error) {
      Logger.debug("Access token verification failed", error);
      return null;
    }
  }

  verifyRefreshToken(token: string): boolean {
    try {
      // For simple refresh tokens, we just check if they exist in database
      // This method should be enhanced to use JWT-based refresh tokens if needed
      return typeof token === "string" && token.length === 128; // 64 bytes = 128 hex chars
    } catch (error) {
      Logger.error("Error verifying refresh token", error);
      return false;
    }
  }

  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return null;
      }
      return new Date(decoded.exp * 1000);
    } catch (error) {
      Logger.error("Error getting token expiration", error);
      return null;
    }
  }

  generateTokenPair(payload: { userId: string; role: UserRole }): ITokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    return {
      accessToken,
      refreshToken,
    };
  }
}
