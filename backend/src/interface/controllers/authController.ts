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

import { SignupRequestDto } from "@application/dto/auth/SignupRequestDto";
import { SignupVerifyDto } from "@application/dto/auth/SignupVerifyDto";
import { LoginDto } from "@application/dto/auth/LoginDto";
import { ResendOtpDto } from "@application/dto/auth/ResendOtpDto";
import { UpdatePasswordDto } from "@application/dto/auth/UpdatePasswordDto";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { ForgotPasswordRequestDto } from "@application/dto";
import { ForgotPasswordVerifyDto } from "@application/dto";
import { GoogleLoginDto } from "@application/dto/auth/GoogleLoginDto";

import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

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
    private getGoogleAuthUrlUseCase: GetGoogleAuthUrlUseCase
  ) {}

  async signupRequest(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new SignupRequestDto(req.body);
      const result = await this.signupRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(400).json(response);
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
      Logger.error("Error in signup request", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async signupVerify(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new SignupVerifyDto(req.body);
      const result = await this.signupVerifyUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };

        if (error.name === "MaxOtpAttemptsError") {
          res.status(429).json(response);
        } else {
          res.status(400).json(response);
        }
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
      Logger.error("Error in signup verification", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new LoginDto(req.body);
      const result = await this.loginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(401).json(response);
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
      Logger.error("Error in login", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new ResendOtpDto(req.body);
      const result = await this.resendOtpUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "New OTP sent to your email address",
      };

      res.status(200).json(response);
      Logger.info("OTP resent successfully", { email: dto.email });
    } catch (error) {
      Logger.error("Error in resend OTP", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation Failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const userId = req.user!.userId;
      const dto = new UpdatePasswordDto(req.body);
      const result = await this.updatePasswordUseCase.execute(userId, dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };

        const statusCode = error.name === "InvalidCredentialsError" ? 401 : 400;
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
      Logger.error("Error in update password", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new RefreshTokenDto(req.body);
      const result = await this.refreshTokenUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };

        // Different status codes for different error types
        if (
          error.name === "RefreshTokenExpiredError" ||
          error.name === "RefreshTokenRevokedError"
        ) {
          res.status(401).json(response);
        } else {
          res.status(400).json(response);
        }
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
      Logger.error("Error in refresh token", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      console.log("errors:", errors);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new RefreshTokenDto(req.body);
      const result = await this.logoutUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Logged out successfully",
      };

      res.status(200).json(response);
      Logger.info("User logged out successfully");
    } catch (error) {
      Logger.error("Error in logout", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async forgotPasswordRequest(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new ForgotPasswordRequestDto(req.body);
      const result = await this.forgotPasswordRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "A password reset OTP has been sent to your email",
      };

      res.status(200).json(response);
      Logger.info("Password reset OTP requested", { email: dto.email });
    } catch (error) {
      Logger.error("Error in forgot password request", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async forgotPasswordVerify(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new ForgotPasswordVerifyDto(req.body);
      const result = await this.forgotPasswordVerifyUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };

        if (error.name === "MaxOtpAttemptsError") {
          res.status(429).json(response);
        } else {
          res.status(400).json(response);
        }
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
      Logger.error("Error in forgot password verification", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  // Get Google OAuth URL
  async getGoogleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getGoogleAuthUrlUseCase.execute();

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Google auth URL generated successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error generating Google auth URL", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  /// Handle Google OAuth callback
  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GoogleLoginDto(req.query);
      const result = await this.googleLoginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        // Redirect to frontend with error
        const frontendUrl = `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`;
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
