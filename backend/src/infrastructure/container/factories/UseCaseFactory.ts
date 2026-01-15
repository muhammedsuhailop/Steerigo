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
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  ForgotPasswordRequestDto,
  ForgotPasswordVerifyDto,
  GetCurrentUserDto,
  GetCurrentUserResponseDto,
  GoogleLoginRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenDto,
  ResendOtpDto,
  SignupRequestDto,
  SignupVerifyDto,
  SignupVerifyResponseDto,
  UpdatePasswordDto,
} from "@application/dto/auth";
import { Result } from "@shared/utils/Result";
import { AutoSearchAndSendRideRequestUseCase } from "@application/use-cases/user/AutoSearchAndSendRideRequestUseCase";

export class UseCaseFactory {
  static register(container: Container): void {
    container
      .bind<
        IUseCase<LoginRequestDto, Promise<Result<LoginResponseDto, Error>>>
      >(TYPES.LoginUseCase)
      .to(LoginUseCase);
    container
      .bind<
        IUseCase<RefreshTokenDto, Promise<Result<void, Error>>>
      >(TYPES.LogoutUseCase)
      .to(LogoutUseCase);

    container
      .bind<
        IUseCase<
          RefreshTokenDto,
          Promise<Result<{ accessToken: string; refreshToken: string }, Error>>
        >
      >(TYPES.RefreshTokenUseCase)
      .to(RefreshTokenUseCase);

    container
      .bind<
        IUseCase<SignupRequestDto, Promise<Result<void, Error>>>
      >(TYPES.SignupRequestUseCase)
      .to(SignupRequestUseCase);

    container
      .bind<
        IUseCase<
          SignupVerifyDto,
          Promise<Result<SignupVerifyResponseDto, Error>>
        >
      >(TYPES.SignupVerifyUseCase)
      .to(SignupVerifyUseCase);
    container
      .bind<
        IUseCase<ForgotPasswordRequestDto, Promise<Result<void>>>
      >(TYPES.ForgotPasswordRequestUseCase)
      .to(ForgotPasswordRequestUseCase);
    container
      .bind<
        IUseCase<ForgotPasswordVerifyDto, Promise<Result<void>>>
      >(TYPES.ForgotPasswordVerifyUseCase)
      .to(ForgotPasswordVerifyUseCase);
    container
      .bind<
        IUseCase<UpdatePasswordDto, Promise<Result<void>>>
      >(TYPES.UpdatePasswordUseCase)
      .to(UpdatePasswordUseCase);
    container
      .bind<
        IUseCase<ResendOtpDto, Promise<Result<{ expiresAt: Date }>>>
      >(TYPES.ResendOtpUseCase)
      .to(ResendOtpUseCase);
    container
      .bind<
        IUseCase<GetCurrentUserDto, Promise<Result<GetCurrentUserResponseDto>>>
      >(TYPES.GetCurrentUserUseCase)
      .to(GetCurrentUserUseCase);
    container
      .bind<
        IUseCase<
          GoogleLoginRequestDto,
          Promise<Result<SignupVerifyResponseDto & { isNewUser: boolean }>>
        >
      >(TYPES.GoogleLoginUseCase)
      .to(GoogleLoginUseCase);
    container
      .bind<
        IUseCase<void, Promise<Result<{ authUrl: string }>>>
      >(TYPES.GetGoogleAuthUrlUseCase)
      .to(GetGoogleAuthUrlUseCase);

    container
      .bind<AutoSearchAndSendRideRequestUseCase>(
        TYPES.AutoSearchAndSendRideRequestUseCase
      )
      .to(AutoSearchAndSendRideRequestUseCase);
  }
}
