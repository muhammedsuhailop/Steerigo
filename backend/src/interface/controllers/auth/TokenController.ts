import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RefreshTokenDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";

@injectable()
export class TokenController {
  constructor(
    @inject(TYPES.LogoutUseCase)
    private logoutUseCase: IUseCase<
      RefreshTokenDto,
      Promise<Result<void, Error>>
    >,
    @inject(TYPES.RefreshTokenUseCase)
    private refreshTokenUseCase: IUseCase<
      RefreshTokenDto,
      Promise<Result<{ accessToken: string; refreshToken: string }, Error>>
    >
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
          message: AuthMessages.REFRESH_TOKEN_REQUIRED,
        });
        return;
      }

      const dto = RefreshTokenDto.fromRequest({ refreshToken });
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
        message: AuthMessages.LOGOUT_SUCCESS,
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

      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: AuthMessages.REFRESH_TOKEN_REQUIRED,
        });
        return;
      }

      const dto = RefreshTokenDto.fromRequest({ refreshToken });
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
        message: AuthMessages.TOKENS_REFRESHED,
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
