import "reflect-metadata";
import { Container } from "inversify";

// Domain Repositories
import { IUserRepository } from "@domain/repositories/IUserRepository";

// Domain Services
import { IPasswordService } from "@domain/services/IPasswordService";
import { IEmailService } from "@domain/services/IEmailService";
import { IOtpService } from "@domain/services/IOtpService";
import { ITokenService } from "@domain/services/ITokenService";
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';

// Infrastructure Implementations
import { MongoUserRepository } from "../database/repositories/MongoUserRepository";
import { BcryptPasswordService } from "../services/BcryptPasswordService";
import { NodemailerEmailService } from "../services/NodemailerEmailService";
import { OtpGeneratorService } from "../services/OtpGeneratorService";
import { JwtTokenService } from "../services/JwtTokenService";
import { MongoRefreshTokenRepository } from '../database/repositories/MongoRefreshTokenRepository';

// Application Use Cases
import { SignupRequestUseCase } from "@application/use-cases/SignupRequestUseCase";
import { SignupVerifyUseCase } from "@application/use-cases/SignupVerifyUseCase";
import { LoginUseCase } from "@application/use-cases/LoginUseCase";
import { ResendOtpUseCase } from "@application/use-cases/ResendOtpUseCase";
import { UpdatePasswordUseCase } from '@application/use-cases/UpdatePasswordUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/RefreshTokenUseCase';
import { LogoutUseCase } from '@application/use-cases/LogoutUseCase';

// Interface Controllers
import { AuthController } from "@interface/controllers/AuthController";

const container = new Container();

// Repository Bindings
container.bind<IUserRepository>("IUserRepository").to(MongoUserRepository);

// Service Bindings
container.bind<IPasswordService>("IPasswordService").to(BcryptPasswordService);
container.bind<IEmailService>("IEmailService").to(NodemailerEmailService);
container.bind<IOtpService>("IOtpService").to(OtpGeneratorService);
container.bind<ITokenService>("ITokenService").to(JwtTokenService);
container.bind<IRefreshTokenRepository>('IRefreshTokenRepository').to(MongoRefreshTokenRepository);

// Use Case Bindings
container.bind<SignupRequestUseCase>(SignupRequestUseCase).toSelf();
container.bind<SignupVerifyUseCase>(SignupVerifyUseCase).toSelf();
container.bind<LoginUseCase>(LoginUseCase).toSelf();
container.bind<ResendOtpUseCase>(ResendOtpUseCase).toSelf();
container.bind<UpdatePasswordUseCase>(UpdatePasswordUseCase).toSelf();
container.bind<RefreshTokenUseCase>(RefreshTokenUseCase).toSelf();
container.bind<LogoutUseCase>(LogoutUseCase).toSelf();

// Controller Bindings
container.bind<AuthController>(AuthController).toSelf();

export { container };
