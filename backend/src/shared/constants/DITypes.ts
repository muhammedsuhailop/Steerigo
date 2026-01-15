// Container Symbols 
export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  AdminUserRepository: Symbol.for("AdminUserRepository"),
  AdminDriverRepository: Symbol.for("AdminDriverRepository"),
  AdminKYCRepository: Symbol.for("AdminKYCRepository"),
  KYCRepository: Symbol.for("KYCRepository"),
  DriverRepository: Symbol.for("DriverRepository"),
  DriverAvailabilityRepository: Symbol.for("DriverAvailabilityRepository"),
  DriverDashboardRepository: Symbol.for("DriverDashboardRepository"),
  FareConfigurationRepository: Symbol.for("FareConfigurationRepository"),
  RideRequestRepository: Symbol.for("RideRequestRepository"),

  // Application Services
  PasswordService: Symbol.for("PasswordService"),
  TokenService: Symbol.for("TokenService"),
  EmailService: Symbol.for("EmailService"),
  OtpService: Symbol.for("OtpService"),
  GoogleAuthService: Symbol.for("GoogleAuthService"),
  FileUploadService: Symbol.for("FileUploadService"),
  TokenManagementService: Symbol.for("TokenManagementService"),
  FareCalculationService: Symbol.for("FareCalculationService"),
  AvailabilityCheckService: Symbol.for("AvailabilityCheckService"),

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
  GetUserProfileDetailsUseCase: Symbol.for("GetUserProfileDetailsUseCase"),

  // Use Cases - Admin Drivers
  GetDriversUseCase: Symbol.for("GetDriversUseCase"),
  DriverActionUseCase: Symbol.for("DriverActionUseCase"),
  GetDriverProfileUseCase: Symbol.for("GetDriverProfileUseCase"),
  GetKycRequestsUseCase: Symbol.for("GetKycRequestsUseCase"),
  UpdateKycStatusUseCase: Symbol.for("UpdateKycStatusUseCase"),
  GetKycRequestByIdUseCase: Symbol.for("GetKycRequestByIdUseCase"),
  KycSubmissionUseCase: Symbol.for("KycSubmissionUseCase"),
  UpdateDriverKycStatusUseCase: Symbol.for("UpdateDriverKycStatusUseCase"),

  // Use Cases - Driver
  RegisterDriverUseCase: Symbol.for("RegisterDriverUseCase"),
  UpdateDriverProfileUseCase: Symbol.for("UpdateDriverProfileUseCase"),
  SubmitKYCUseCase: Symbol.for("SubmitKYCUseCase"),
  GetKYCStatusUseCase: Symbol.for("GetKYCStatusUseCase"),
  GetDriverDashboardUseCase: Symbol.for("GetDriverDashboardUseCase"),
  GetDriverStatusUseCase: Symbol.for("GetDriverStatusUseCase"),
  GetDriverDetailedProfileUseCase: Symbol.for(
    "GetDriverDetailedProfileUseCase"
  ),
  SendRideRequestUseCase: Symbol.for("SendRideRequestUseCase"),
  ScheduleRecurringAvailabilityUseCase: Symbol.for(
    "ScheduleRecurringAvailabilityUseCase"
  ),
  AddAvailabilityExceptionUseCase: Symbol.for(
    "AddAvailabilityExceptionUseCase"
  ),

  // Use Cases - User
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  UpdateUserProfileUseCase: Symbol.for("UpdateUserProfileUseCase"),
  RegisterUserAsDriverUseCase: Symbol.for("RegisterUserAsDriverUseCase"),
  FindNearbyDriversUseCase: Symbol.for("FindNearbyDriversUseCase"),
  AutoSearchAndSendRideRequestUseCase: Symbol.for(
    "AutoSearchAndSendRideRequestUseCase"
  ),

  // Use Cases - File
  UploadFileUseCase: Symbol.for("UploadFileUseCase"),
  GetUserFilesUseCase: Symbol.for("GetUserFilesUseCase"),
  DeleteFileUseCase: Symbol.for("DeleteFileUseCase"),
  UpdateProfilePictureUseCase: Symbol.for("UpdateProfilePictureUseCase"),

  // Use Cases Driver Availability
  ScheduleAvailabilityUseCase: Symbol.for("ScheduleAvailabilityUseCase"),
  UpdateAvailabilityStatusUseCase: Symbol.for(
    "UpdateAvailabilityStatusUseCase"
  ),
  UpdateDriverLocationUseCase: Symbol.for("UpdateDriverLocationUseCase"),

  // Controllers
  LoginController: Symbol.for("LoginController"),
  SignupController: Symbol.for("SignupController"),
  OtpController: Symbol.for("OtpController"),
  PasswordController: Symbol.for("PasswordController"),
  SocialAuthController: Symbol.for("SocialAuthController"),
  UserAuthController: Symbol.for("UserAuthController"),
  // AuthUserController: Symbol.for("AuthUserController"),
  TokenController: Symbol.for("TokenController"),
  AdminUserController: Symbol.for("AdminUserController"),
  AdminDriverController: Symbol.for("AdminDriverController"),
  DriverController: Symbol.for("DriverController"),
  UserProfileController: Symbol.for("UserProfileController"),
  FileController: Symbol.for("FileController"),
  DriverAvailabilityController: Symbol.for("DriverAvailabilityController"),
  DriverSearchController: Symbol.for("DriverSearchController"),
  RideController: Symbol.for("RideController"),
  AutoRideController: Symbol.for("AutoRideController"),
};
