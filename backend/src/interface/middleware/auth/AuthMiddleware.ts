import { Request, Response, NextFunction } from "express";
import { container } from "@infrastructure/container/Container";
import { ITokenService } from "@domain/services/ITokenService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
// Extend Request interface to include user
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => authMiddlewareClass.authenticate(req, res, next);

class authMiddlewareClass {
  static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, message: "Access token required" });
        return;
      }

      const token = authHeader.substring(7);
      const tokenService = container.get<ITokenService>("ITokenService");
      const payload = tokenService.verify(token);

      if (!payload) {
        res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
        return;
      }

      const userRepository = container.get<IUserRepository>("IUserRepository");
      const user = await userRepository.findById(payload.userId);

      if (!user || !user.getIsVerified()) {
        res
          .status(401)
          .json({
            success: false,
            message: "User account not found or not verified",
          });
        return;
      }

      req.user = {
        userId: payload.userId,
        role: payload.role,
      };

      next();
    } catch (error) {
      Logger.error("Authentication middleware error", error);
      res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
  }
}
