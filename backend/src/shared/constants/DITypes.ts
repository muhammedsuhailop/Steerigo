// Container Symbols (for better type safety)
export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),

  // Services
  PasswordService: Symbol.for("PasswordService"),
  TokenService: Symbol.for("TokenService"),

  // Use Cases
  LoginUseCase: Symbol.for("LoginUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
};
