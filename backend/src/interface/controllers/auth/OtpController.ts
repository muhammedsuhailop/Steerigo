import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ResendOtpUseCase } from "@application/use-cases/auth/ResendOtpUseCase";
import {
  ForgotPasswordRequestUseCase,
  ForgotPasswordVerifyUseCase,
} from "@application/use-cases";
import {
  ResendOtpDto,
  ForgotPasswordRequestDto,
  ForgotPasswordVerifyDto,
} from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class OtpController {
  constructor(
    @inject(ResendOtpUseCase) private resendOtpUseCase: ResendOtpUseCase,
    @inject(ForgotPasswordRequestUseCase)
    private forgotPasswordRequestUseCase: ForgotPasswordRequestUseCase,
    @inject(ForgotPasswordVerifyUseCase)
    private forgotPasswordVerifyUseCase: ForgotPasswordVerifyUseCase
  ) {}

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = new ResendOtpDto(req.body);
      const result = await this.resendOtpUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "resend_otp"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "New OTP sent to your email address",
      };

      res.status(200).json(response);
      Logger.info("OTP resent successfully", { email: dto.email });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "resend_otp"
      );
      res.status(statusCode).json(response);
    }
  }
  async forgotPasswordRequest(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

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
        message: "A password reset OTP has been sent to your email",
      };

      res.status(200).json(response);
      Logger.info("Password reset OTP requested", { email: dto.email });
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

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
        message:
          "Password reset successfully. Please login with your new password",
      };

      res.status(200).json(response);
      Logger.info("Password reset completed successfully", {
        email: dto.email,
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "forgot_password_verify"
      );
      res.status(statusCode).json(response);
    }
  }
}
