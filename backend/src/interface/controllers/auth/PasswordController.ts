import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ForgotPasswordRequestUseCase } from "@application/use-cases/auth/ForgotPasswordRequestUseCase";
import { ForgotPasswordVerifyUseCase } from "@application/use-cases/auth/ForgotPasswordVerifyUseCase";
import { UpdatePasswordUseCase } from "@application/use-cases/auth/UpdatePasswordUseCase";
import { ForgotPasswordRequestDto } from "@application/dto/auth/ForgotPasswordRequestDto";
import { ForgotPasswordVerifyDto } from "@application/dto/auth/ForgotPasswordVerifyDto";
import { UpdatePasswordDto } from "@application/dto/auth/UpdatePasswordDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class PasswordController {
  constructor(
    @inject(TYPES.ForgotPasswordRequestUseCase)
    private forgotPasswordRequestUseCase: ForgotPasswordRequestUseCase,
    @inject(TYPES.ForgotPasswordVerifyUseCase)
    private forgotPasswordVerifyUseCase: ForgotPasswordVerifyUseCase,
    @inject(TYPES.UpdatePasswordUseCase)
    private updatePasswordUseCase: UpdatePasswordUseCase
  ) {}

  async forgotPasswordRequest(req: Request, res: Response): Promise<void> {
    try {
      const dto = new ForgotPasswordRequestDto(req.body);
      const result = await this.forgotPasswordRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "forgot_password_request"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: AuthMessages.PASSWORD_RESET_REQUEST_SUCCESS,
      };

      res.status(200).json(response);
      Logger.info("Forgot password request completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "forgot_password_request"
      );
      res.status(statusCode).json(response);
    }
  }

  async forgotPasswordVerify(req: Request, res: Response): Promise<void> {
    try {
      const dto = new ForgotPasswordVerifyDto(req.body);
      const result = await this.forgotPasswordVerifyUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "forgot_password_verify"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: AuthMessages.PASSWORD_RESET_SUCCESS,
      };

      res.status(200).json(response);
      Logger.info("Forgot password verify completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "forgot_password_verify"
      );
      res.status(statusCode).json(response);
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId; // From auth middleware
      const dto = new UpdatePasswordDto({
        userId,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      });

      const result = await this.updatePasswordUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_password"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: AuthMessages.PASSWORD_UPDATE_SUCCESS,
      };

      res.status(200).json(response);
      Logger.info("Update password completed successfully", {
        userId: dto.getUserId(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_password"
      );
      res.status(statusCode).json(response);
    }
  }
}
