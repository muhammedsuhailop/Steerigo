import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ForgotPasswordRequestDto } from "@application/dto/auth/ForgotPasswordRequestDto";
import { ForgotPasswordVerifyDto } from "@application/dto/auth/ForgotPasswordVerifyDto";
import { UpdatePasswordDto } from "@application/dto/auth/UpdatePasswordDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";

@injectable()
export class PasswordController {
  constructor(
    @inject(TYPES.ForgotPasswordRequestUseCase)
    private forgotPasswordRequestUseCase: IUseCase<
      ForgotPasswordRequestDto,
      Promise<Result<void>>
    >,
    @inject(TYPES.ForgotPasswordVerifyUseCase)
    private forgotPasswordVerifyUseCase: IUseCase<
      ForgotPasswordVerifyDto,
      Promise<Result<void>>
    >,
    @inject(TYPES.UpdatePasswordUseCase)
    private updatePasswordUseCase: IUseCase<
      UpdatePasswordDto,
      Promise<Result<void>>
    >
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

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Forgot password request completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      Logger.error("Forgot password request controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: AuthMessages.INTERNAL_SERVER_ERROR,
      });
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

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Forgot password verify completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      Logger.error("Forgot password verify controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: AuthMessages.INTERNAL_SERVER_ERROR,
      });
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

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Update password completed successfully", {
        userId: dto.getUserId(),
      });
    } catch (error) {
      Logger.error("Update password controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: AuthMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
