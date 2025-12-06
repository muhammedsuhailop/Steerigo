import { Request, Response, NextFunction } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { ITokenService } from "@application/services/ITokenService";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

// Extend Request interface to include user
declare module "express" {
  interface Request {
    user?: {
      userId: string;
      role: string;
    };
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        message: AuthMessages.ACCESS_TOKEN_REQUIRED,
      };
      res.status(HttpStatusCodes.UNAUTHORIZED).json(response);
      return;
    }

    const token = authHeader.substring(7);
    const tokenService = container.get<ITokenService>(TYPES.TokenService);

    const payload = tokenService.verifyAccessToken(token);
    if (!payload) {
      const response: ApiResponse = {
        success: false,
        message: AuthMessages.TOKEN_INVALID,
      };
      res.status(HttpStatusCodes.UNAUTHORIZED).json(response);
      return;
    }

    // Verify user still exists and is active
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
    const user = await userRepository.findById(payload.userId);

    if (!user || !user.canLogin()) {
      const response: ApiResponse = {
        success: false,
        message: AuthMessages.AUTHENTICATION_FAILED,
      };
      res.status(HttpStatusCodes.UNAUTHORIZED).json(response);
      return;
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    Logger.debug("Authentication successful", {
      userId: payload.userId,
      role: payload.role,
    });

    next();
  } catch (error) {
    Logger.error("Authentication middleware error", error);
    const response: ApiResponse = {
      success: false,
      message: AuthMessages.AUTHENTICATION_FAILED,
    };
    res.status(HttpStatusCodes.UNAUTHORIZED).json(response);
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: AuthMessages.AUTHENTICATION_FAILED,
      };
      res.status(HttpStatusCodes.UNAUTHORIZED).json(response);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        message: "Insufficient permissions",
      };
      res.status(HttpStatusCodes.FORBIDDEN).json(response);
      return;
    }

    next();
  };
};
