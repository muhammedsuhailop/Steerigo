import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Repositories
import { UserRepository } from "@application/repositories/UserRepository";
import { RefreshTokenRepository } from "@application/repositories/RefreshTokenRepository";
import { UserRepositoryImpl } from "@infrastructure/database/repositories/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "@infrastructure/database/repositories/RefreshTokenRepositoryImpl";

// Application Services
import { PasswordService } from "@application/services/PasswordService";
import { TokenService } from "@application/services/TokenService";
import { EmailService } from "@application/services/EmailService";
import { OtpService } from "@application/services/OtpService";
import { GoogleAuthService } from "@application/services/GoogleAuthService";

// Infrastructure Services
import { PasswordServiceImpl } from "@infrastructure/services/PasswordServiceImpl";
import { TokenServiceImpl } from "@infrastructure/services/TokenServiceImpl";
import { EmailServiceImpl } from "@infrastructure/services/EmailServiceImpl";
import { OtpServiceImpl } from "@infrastructure/services/OtpServiceImpl";
import { GoogleAuthServiceImpl } from "@infrastructure/services/GoogleAuthServiceImpl";

// Use Cases
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

// Controllers
import { LoginController } from "@interface/controllers/auth/LoginController";
import { SignupController } from "@interface/controllers/auth/SignupController";
import { PasswordController } from "@interface/controllers/auth/PasswordController";
import { OtpController } from "@interface/controllers/auth/OtpController";
import { SocialAuthController } from "@interface/controllers/auth/SocialAuthController";
import { UserController } from "@interface/controllers/auth/UserController";

const container = new Container();

// Bind Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container
  .bind<RefreshTokenRepository>(TYPES.RefreshTokenRepository)
  .to(RefreshTokenRepositoryImpl);

// Bind Application Services
container.bind<PasswordService>(TYPES.PasswordService).to(PasswordServiceImpl);
container.bind<TokenService>(TYPES.TokenService).to(TokenServiceImpl);
container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl);
container.bind<OtpService>(TYPES.OtpService).to(OtpServiceImpl);
container
  .bind<GoogleAuthService>(TYPES.GoogleAuthService)
  .to(GoogleAuthServiceImpl);

// Bind Use Cases
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
container
  .bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase)
  .to(RefreshTokenUseCase);
container
  .bind<SignupRequestUseCase>(TYPES.SignupRequestUseCase)
  .to(SignupRequestUseCase);
container
  .bind<SignupVerifyUseCase>(TYPES.SignupVerifyUseCase)
  .to(SignupVerifyUseCase);
container
  .bind<ForgotPasswordRequestUseCase>(TYPES.ForgotPasswordRequestUseCase)
  .to(ForgotPasswordRequestUseCase);
container
  .bind<ForgotPasswordVerifyUseCase>(TYPES.ForgotPasswordVerifyUseCase)
  .to(ForgotPasswordVerifyUseCase);
container
  .bind<UpdatePasswordUseCase>(TYPES.UpdatePasswordUseCase)
  .to(UpdatePasswordUseCase);
container.bind<ResendOtpUseCase>(TYPES.ResendOtpUseCase).to(ResendOtpUseCase);
container
  .bind<GetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase)
  .to(GetCurrentUserUseCase);
container
  .bind<GoogleLoginUseCase>(TYPES.GoogleLoginUseCase)
  .to(GoogleLoginUseCase);
container
  .bind<GetGoogleAuthUrlUseCase>(TYPES.GetGoogleAuthUrlUseCase)
  .to(GetGoogleAuthUrlUseCase);

// Bind Controllers
container.bind<LoginController>(TYPES.LoginController).to(LoginController);
container.bind<SignupController>(TYPES.SignupController).to(SignupController);
container
  .bind<PasswordController>(TYPES.PasswordController)
  .to(PasswordController);
container.bind<OtpController>(TYPES.OtpController).to(OtpController);
container
  .bind<SocialAuthController>(TYPES.SocialAuthController)
  .to(SocialAuthController);
container.bind<UserController>(TYPES.UserController).to(UserController);

export { container };
