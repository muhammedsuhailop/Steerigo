// Container Symbols (for better type safety)
export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  AdminUserRepository: Symbol.for("AdminUserRepository"),
  AdminDriverRepository: Symbol.for("AdminDriverRepository"),
  KYCRepository: Symbol.for("KYCRepository"),

  // Application Services
  PasswordService: Symbol.for("PasswordService"),
  TokenService: Symbol.for("TokenService"),
  EmailService: Symbol.for("EmailService"),
  OtpService: Symbol.for("OtpService"),
  GoogleAuthService: Symbol.for("GoogleAuthService"),
  FileUploadService: Symbol.for("FileUploadService"),
  TokenManagementService: Symbol.for("TokenManagementService"),

  // Adapters
  CryptoAdapter: Symbol.for("CryptoAdapter"),

  // Use Cases - Auth
  LoginUseCase: Symbol.for("LoginUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
  SignupRequestUseCase: Symbol.for("SignupRequestUseCase"),
  SignupVerifyUseCase: Symbol.for("SignupVerifyUseCase"),
  ForgotPasswordRequestUseCase: Symbol.for("ForgotPasswordRequestUseCase"),
  ForgotPasswordVerifyUseCase: Symbol.for("ForgotPasswordVerifyUseCase"),
  UpdatePasswordUseCase: Symbol.for("UpdatePasswordUseCase"),
  ResendOtpUseCase: Symbol.for("ResendOtpUseCase"),
  GetCurrentUserUseCase: Symbol.for("GetCurrentUserUseCase"),
  GoogleLoginUseCase: Symbol.for("GoogleLoginUseCase"),
  GetGoogleAuthUrlUseCase: Symbol.for("GetGoogleAuthUrlUseCase"),

  // Use Cases - Admin Users
  GetUsersUseCase: Symbol.for("GetUsersUseCase"),
  UpdateUserStatusUseCase: Symbol.for("UpdateUserStatusUseCase"),

  // Use Cases - Admin Drivers
  GetDriversUseCase: Symbol.for("GetDriversUseCase"),
  DriverActionUseCase: Symbol.for("DriverActionUseCase"),
  GetDriverProfileUseCase: Symbol.for("GetDriverProfileUseCase"),
  GetKycRequestsUseCase: Symbol.for("GetKycRequestsUseCase"),
  UpdateKycStatusUseCase: Symbol.for("UpdateKycStatusUseCase"),
  GetKycRequestByIdUseCase: Symbol.for("GetKycRequestByIdUseCase"),

  // Controllers
  LoginController: Symbol.for("LoginController"),
  SignupController: Symbol.for("SignupController"),
  OtpController: Symbol.for("OtpController"),
  PasswordController: Symbol.for("PasswordController"),
  SocialAuthController: Symbol.for("SocialAuthController"),
  UserController: Symbol.for("UserController"),
  UserAuthController: Symbol.for("UserAuthController"),
  TokenController: Symbol.for("TokenController"),
  AdminUserController: Symbol.for("AdminUserController"),
  AdminDriverController: Symbol.for("AdminDriverController"),
};
