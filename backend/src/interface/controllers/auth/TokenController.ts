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
        message: "Logged out successfully",
      };

      res.status(200).json(response);
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
        message: "Tokens refreshed successfully",
        data,
      };

      res.status(200).json(response);
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
