import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Import all use cases
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { SignupRequestUseCase } from "@application/use-cases/auth/SignupRequestUseCase";
import { SignupVerifyUseCase } from "@application/use-cases/auth/SignupVerifyUseCase";
import { ForgotPasswordRequestUseCase } from "@application/use-cases/auth/ForgotPasswordRequestUseCase";
import { ForgotPasswordVerifyUseCase } from "@application/use-cases/auth/ForgotPasswordVerifyUseCase";
import { UpdatePasswordUseCase } from "@application/use-cases/auth/UpdatePasswordUseCase";
import { ResendOtpUseCase } from "@application/use-cases/auth/ResendOtpUseCase";
import { GetCurrentUserUseCase } from "@application/use-cases/auth/GetCurrentUserUseCase";
import { GoogleLoginUseCase } from "@application/use-cases/auth/GoogleLoginUseCase";
import { GetGoogleAuthUrlUseCase } from "@application/use-cases/auth/GetGoogleAuthUrlUseCase";

export class UseCaseFactory {
  static register(container: Container): void {
    container.bind(TYPES.LoginUseCase).to(LoginUseCase);
    container.bind(TYPES.LogoutUseCase).to(LogoutUseCase);
    container.bind(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase);
    container.bind(TYPES.SignupRequestUseCase).to(SignupRequestUseCase);
    container.bind(TYPES.SignupVerifyUseCase).to(SignupVerifyUseCase);
    container
      .bind(TYPES.ForgotPasswordRequestUseCase)
      .to(ForgotPasswordRequestUseCase);
    container
      .bind(TYPES.ForgotPasswordVerifyUseCase)
      .to(ForgotPasswordVerifyUseCase);
    container.bind(TYPES.UpdatePasswordUseCase).to(UpdatePasswordUseCase);
    container.bind(TYPES.ResendOtpUseCase).to(ResendOtpUseCase);
    container.bind(TYPES.GetCurrentUserUseCase).to(GetCurrentUserUseCase);
    container.bind(TYPES.GoogleLoginUseCase).to(GoogleLoginUseCase);
    container.bind(TYPES.GetGoogleAuthUrlUseCase).to(GetGoogleAuthUrlUseCase);
  }
}
