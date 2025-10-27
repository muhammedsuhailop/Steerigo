import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { RefreshTokenDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

@injectable()
export class TokenController {
  constructor(
    @inject(TYPES.LogoutUseCase) private logoutUseCase: LogoutUseCase,
    @inject(TYPES.RefreshTokenUseCase)
    private refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      // Get refresh token from httpOnly cookie
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "No refresh token provided",
        });
        return;
      }

      const dto = new RefreshTokenDto({ refreshToken });
      const result = await this.logoutUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "logout"
        );
        res.status(statusCode).json(response);
        return;
      }

      // Clear the refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
      });

      const response: ApiResponse = {
        success: true,
        message: "Logged out successfully",
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("User logged out successfully");
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "logout"
      );
      res.status(statusCode).json(response);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      // Get refresh token from httpOnly cookie
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "No refresh token provided",
        });
        return;
      }

      const dto = new RefreshTokenDto({ refreshToken });
      const result = await this.refreshTokenUseCase.execute(dto);

      if (result.isFailure()) {
        // Clear invalid cookie
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });

        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "refresh_token"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      // Set new refresh token as httpOnly cookie
      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true, // Cannot be accessed by JavaScript
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/", // Available for all routes
      });

      // Send access token in response body
      const response: ApiResponse = {
        success: true,
        message: "Tokens refreshed successfully",
        data: {
          accessToken: data.accessToken,
        },
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Tokens refreshed successfully");
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "refresh_token"
      );
      res.status(statusCode).json(response);
    }
  }
}
