import "reflect-metadata";
import { Container } from "inversify";

// Repository Interfaces & Implementations
import { UserRepository } from "@domain/repositories/UserRepository";
import { RefreshTokenRepository } from "@domain/repositories/RefreshTokenRepository";
import { UserRepositoryImpl } from "../database/repositories/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "../database/repositories/RefreshTokenRepositoryImpl";

// Service Interfaces & Implementations
import { PasswordService } from "@application/services/PasswordService";
import { TokenService } from "@application/services/TokenService";
import { PasswordServiceImpl } from "../services/PasswordServiceImpl";
import { TokenServiceImpl } from "../services/TokenServiceImpl";

// Use Cases
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";

// Import TYPES from separate file
import { TYPES } from "@shared/constants/DITypes";

const DIContainer = new Container({
  defaultScope: "Singleton",
  skipBaseClassChecks: true,
});

// Repository Bindings
DIContainer.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
DIContainer.bind<RefreshTokenRepository>(TYPES.RefreshTokenRepository).to(
  RefreshTokenRepositoryImpl
);

// Service Bindings
DIContainer.bind<PasswordService>(TYPES.PasswordService).to(
  PasswordServiceImpl
);
DIContainer.bind<TokenService>(TYPES.TokenService).to(TokenServiceImpl);

// Use Case Bindings
DIContainer.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
DIContainer.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
DIContainer.bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(
  RefreshTokenUseCase
);

export { DIContainer, TYPES };
