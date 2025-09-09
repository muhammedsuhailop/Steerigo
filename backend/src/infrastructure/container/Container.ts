import "reflect-metadata";
import { Container } from "inversify";

// Domain Repositories
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { IDriverRepository } from "@domain/repositories/driver/IDriverRepository";
import { IDriverKycRepository } from "@domain/repositories/driver/IDriverKycRepository";

// Domain Services
import { IPasswordService } from "@domain/services/IPasswordService";
import { IEmailService } from "@domain/services/IEmailService";
import { IOtpService } from "@domain/services/IOtpService";
import { ITokenService } from "@domain/services/ITokenService";
import { IGoogleAuthService } from "@domain/services/IGoogleAuthService";

// Infrastructure Implementations
import { MongoUserRepository } from "../database/repositories/MongoUserRepository";
import { BcryptPasswordService } from "../services/BcryptPasswordService";
import { NodemailerEmailService } from "../services/NodemailerEmailService";
import { OtpGeneratorService } from "../services/OtpGeneratorService";
import { JwtTokenService } from "../services/JwtTokenService";
import { MongoRefreshTokenRepository } from "../database/repositories/MongoRefreshTokenRepository";
import { MongoDriverRepository } from "../database/repositories/driver/MongoDriverRepository";
import { MongoDriverKycRepository } from "../database/repositories/driver/MongoDriverKycRepository";
import { GoogleAuthService } from "../services/GoogleAuthService";

// Application Use Cases
import { SignupRequestUseCase } from "@application/use-cases/auth/SignupRequestUseCase";
import { SignupVerifyUseCase } from "@application/use-cases/auth/SignupVerifyUseCase";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { ResendOtpUseCase } from "@application/use-cases/auth/ResendOtpUseCase";
import { UpdatePasswordUseCase } from "@application/use-cases/auth/UpdatePasswordUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { ForgotPasswordRequestUseCase } from "@application/use-cases";
import { ForgotPasswordVerifyUseCase } from "@application/use-cases";
import { RegisterDriverUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { DriverController } from "@interface/controllers/driver/DriverController";
import { GoogleLoginUseCase } from "@application/use-cases/auth/GoogleLoginUseCase";
import { GetGoogleAuthUrlUseCase } from "@application/use-cases/auth/GetGoogleAuthUrlUseCase";

// Interface Controllers
import { AuthController } from "@interface/controllers/AuthController";

const container = new Container();

// Repository Bindings
container.bind<IUserRepository>("IUserRepository").to(MongoUserRepository);
container
  .bind<IRefreshTokenRepository>("IRefreshTokenRepository")
  .to(MongoRefreshTokenRepository);
container
  .bind<IDriverRepository>("IDriverRepository")
  .to(MongoDriverRepository);
container
  .bind<IDriverKycRepository>("IDriverKycRepository")
  .to(MongoDriverKycRepository);

// Service Bindings
container.bind<IPasswordService>("IPasswordService").to(BcryptPasswordService);
container.bind<IEmailService>("IEmailService").to(NodemailerEmailService);
container.bind<IOtpService>("IOtpService").to(OtpGeneratorService);
container.bind<ITokenService>("ITokenService").to(JwtTokenService);
container.bind<IGoogleAuthService>("IGoogleAuthService").to(GoogleAuthService);

// Use Case Bindings
container.bind<SignupRequestUseCase>(SignupRequestUseCase).toSelf();
container.bind<SignupVerifyUseCase>(SignupVerifyUseCase).toSelf();
container.bind<LoginUseCase>(LoginUseCase).toSelf();
container.bind<ResendOtpUseCase>(ResendOtpUseCase).toSelf();
container.bind<UpdatePasswordUseCase>(UpdatePasswordUseCase).toSelf();
container.bind<RefreshTokenUseCase>(RefreshTokenUseCase).toSelf();
container.bind<LogoutUseCase>(LogoutUseCase).toSelf();
container
  .bind<ForgotPasswordRequestUseCase>(ForgotPasswordRequestUseCase)
  .toSelf();
container
  .bind<ForgotPasswordVerifyUseCase>(ForgotPasswordVerifyUseCase)
  .toSelf();
container.bind<RegisterDriverUseCase>(RegisterDriverUseCase).toSelf();
container.bind<GoogleLoginUseCase>(GoogleLoginUseCase).toSelf();
container.bind<GetGoogleAuthUrlUseCase>(GetGoogleAuthUrlUseCase).toSelf();

// Controller Bindings
container.bind<AuthController>(AuthController).toSelf();
container.bind<DriverController>(DriverController).toSelf();

export { container };
