import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { LoginRequestDto } from "@application/dto/auth/LoginRequestDto";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { ApiResponse } from "@shared/types/Common";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class AuthController {
  private loginUseCase: LoginUseCase;
  constructor(
    @inject(TYPES.LoginUseCase) loginUseCase: LoginUseCase,
    @inject(TYPES.LogoutUseCase) private logoutUseCase: LogoutUseCase,
    @inject(TYPES.RefreshTokenUseCase)
    private refreshTokenUseCase: RefreshTokenUseCase
  ) {
    this.loginUseCase = loginUseCase;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Login request received", {
        email: req.body.email,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      });

      // Create DTO 
      const dto = new LoginRequestDto(req.body);

      // Execute use case
      const result = await this.loginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "login"
        );
        res.status(statusCode).json(response);
        return;
      }

      // Success response
      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.LOGIN_SUCCESS,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);

      Logger.info("Login completed successfully", {
        email: dto.getEmailValue(),
        userId: data.user.id,
        role: data.user.role,
      });
    } catch (error) {
      Logger.error("Login controller error", { error });
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "login"
      );
      res.status(statusCode).json(response);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Logout request received", {
        userId: req.user?.userId,
        ip: req.ip,
      });

      const dto = new RefreshTokenDto(req.body);
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

      const response: ApiResponse = {
        success: true,
        message: AuthMessages.LOGOUT_SUCCESS,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Logout completed successfully", {
        userId: req.user?.userId,
      });
    } catch (error) {
      Logger.error("Logout controller error", { error });
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "logout"
      );
      res.status(statusCode).json(response);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Token refresh request received", { ip: req.ip });

      const dto = new RefreshTokenDto(req.body);
      const result = await this.refreshTokenUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "refresh_token"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.TOKEN_REFRESH_SUCCESS,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Token refresh completed successfully");
    } catch (error) {
      Logger.error("Token refresh controller error", { error });
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "refresh_token"
      );
      res.status(statusCode).json(response);
    }
  }
}
