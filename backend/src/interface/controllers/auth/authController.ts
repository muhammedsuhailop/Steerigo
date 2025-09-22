import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { SignupRequestUseCase } from "@application/use-cases/auth/SignupRequestUseCase";
import { SignupVerifyUseCase } from "@application/use-cases/auth/SignupVerifyUseCase";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { ResendOtpUseCase } from "@application/use-cases/auth/ResendOtpUseCase";
import { UpdatePasswordUseCase } from "@application/use-cases/auth/UpdatePasswordUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { ForgotPasswordRequestUseCase } from "@application/use-cases";
import { ForgotPasswordVerifyUseCase } from "@application/use-cases";
import { GoogleLoginUseCase } from "@application/use-cases/auth/GoogleLoginUseCase";
import { GetGoogleAuthUrlUseCase } from "@application/use-cases/auth/GetGoogleAuthUrlUseCase";
import { GetCurrentUserUseCase } from "@application/use-cases/auth/GetCurrentUserUseCase";

import { SignupRequestDto } from "@application/dto/auth/SignupRequestDto";
import { SignupVerifyDto } from "@application/dto/auth/SignupVerifyDto";
import { LoginDto } from "@application/dto/auth/LoginDto";
import { ResendOtpDto } from "@application/dto/auth/ResendOtpDto";
import { UpdatePasswordDto } from "@application/dto/auth/UpdatePasswordDto";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { ForgotPasswordRequestDto } from "@application/dto";
import { ForgotPasswordVerifyDto } from "@application/dto";
import { GoogleLoginDto } from "@application/dto/auth/GoogleLoginDto";
import { GetCurrentUserDto } from "@application/dto/auth/GetCurrentUserDto";

import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class AuthController {
  constructor(
    @inject(SignupRequestUseCase)
    private signupRequestUseCase: SignupRequestUseCase,
    @inject(SignupVerifyUseCase)
    private signupVerifyUseCase: SignupVerifyUseCase,
    @inject(LoginUseCase) private loginUseCase: LoginUseCase,
    @inject(ResendOtpUseCase) private resendOtpUseCase: ResendOtpUseCase,
    @inject(UpdatePasswordUseCase)
    private updatePasswordUseCase: UpdatePasswordUseCase,
    @inject(RefreshTokenUseCase)
    private refreshTokenUseCase: RefreshTokenUseCase,
    @inject(LogoutUseCase) private logoutUseCase: LogoutUseCase,
    @inject(ForgotPasswordRequestUseCase)
    private forgotPasswordRequestUseCase: ForgotPasswordRequestUseCase,
    @inject(ForgotPasswordVerifyUseCase)
    private forgotPasswordVerifyUseCase: ForgotPasswordVerifyUseCase,
    @inject(GoogleLoginUseCase) private googleLoginUseCase: GoogleLoginUseCase,
    @inject(GetGoogleAuthUrlUseCase)
    private getGoogleAuthUrlUseCase: GetGoogleAuthUrlUseCase,
    @inject(GetCurrentUserUseCase)
    private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  async signupRequest(req: Request, res: Response): Promise<void> {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = new SignupRequestDto(req.body);
      const result = await this.signupRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "signup_request"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message:
          "OTP sent to your email address. Please verify to complete signup.",
      };

      res.status(200).json(response);
      Logger.info("Signup request processed successfully", {
        email: dto.email,
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "signup_request"
      );
      res.status(statusCode).json(response);
    }
  }

  async signupVerify(req: Request, res: Response): Promise<void> {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = new SignupVerifyDto(req.body);
      const result = await this.signupVerifyUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "signup_verify"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: "Signup completed successfully! Welcome to SteeriGo.",
        data,
      };

      res.status(201).json(response);
      Logger.info("Signup verification completed successfully", {
        email: dto.email,
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "signup_verify"
      );
      res.status(statusCode).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = new LoginDto(req.body);
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

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: "Login successful",
        data,
      };

      res.status(200).json(response);
      Logger.info("Login completed successfully", { email: dto.email });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "login"
      );
      res.status(statusCode).json(response);
    }
  }

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

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const userId = req.user!.userId;
      const dto = new UpdatePasswordDto(req.body);
      const result = await this.updatePasswordUseCase.execute(userId, dto);

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
        message: "Password updated successfully",
      };

      res.status(200).json(response);
      Logger.info("Password updated successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_password"
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

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const dto = new GetCurrentUserDto(userId);
      const result = await this.getCurrentUserUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_current_user"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "User data fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
      Logger.info("Current user fetched successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_current_user"
      );
      res.status(statusCode).json(response);
    }
  }

  async getGoogleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getGoogleAuthUrlUseCase.execute();

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_google_auth_url"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Google auth URL generated successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_google_auth_url"
      );
      res.status(statusCode).json(response);
    }
  }

  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GoogleLoginDto(req.query);
      const result = await this.googleLoginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        // For OAuth callback, redirect to frontend with error
        const frontendUrl = `${process.env.FRONTEND_URL}/login?error=authentication_failed`;
        res.redirect(frontendUrl);
        return;
      }

      const data = result.getValue();
      const frontendUrl =
        `${process.env.FRONTEND_URL}/auth/callback?` +
        `accessToken=${encodeURIComponent(data.accessToken)}` +
        `&refreshToken=${encodeURIComponent(data.refreshToken)}` +
        `&isNewUser=${data.isNewUser}`;

      res.redirect(frontendUrl);
      Logger.info("Google login completed successfully", {
        email: data.user.email,
        isNewUser: data.isNewUser,
      });
    } catch (error) {
      Logger.error("Error in Google callback", error);
      const frontendUrl = `${process.env.FRONTEND_URL}/login?error=authentication_failed`;
      res.redirect(frontendUrl);
    }
  }
}
