// import "reflect-metadata";
// import { Container } from "inversify";

// // Domain Repositories
// import { IUserRepository } from "@domain/repositories/IUserRepository";
// import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
// import { IDriverRepository } from "@domain/repositories/driver/IDriverRepository";
// import { IDriverKycRepository } from "@domain/repositories/driver/IDriverKycRepository";
// import { IAdminUserRepository } from "@domain/repositories/admin/IAdminUserRepository";
// import { MongoAdminUserRepository } from "../database/repositories/admin/MongoAdminUserRepository";

// // Domain Services
// import { IPasswordService } from "@domain/services/IPasswordService";
// import { IEmailService } from "@domain/services/IEmailService";
// import { IOtpService } from "@domain/services/IOtpService";
// import { ITokenService } from "@domain/services/ITokenService";
// import { IGoogleAuthService } from "@domain/services/IGoogleAuthService";
// import { IFileUploadService } from "@domain/services/IFileUploadService";
// import { CloudinaryService } from "../services/CloudinaryService";

// // Infrastructure Implementations
// // import { MongoUserRepository } from "../database/repositories/MongoUserRepository";
// import { MongoRefreshTokenRepository } from "../database/repositories/MongoRefreshTokenRepository";
// import { MongoDriverRepository } from "../database/repositories/driver/MongoDriverRepository";
// import { MongoDriverKycRepository } from "../database/repositories/driver/MongoDriverKycRepository";

// import { BcryptPasswordService } from "../services/BcryptPasswordService";
// import { NodemailerEmailService } from "../services/NodemailerEmailService";
// import { OtpGeneratorService } from "../services/OtpGeneratorService";
// import { JwtTokenService } from "../services/JwtTokenService";
// import { GoogleAuthService } from "../services/GoogleAuthService";

// // Application Use Cases
// import { SignupRequestUseCase } from "@application/use-cases/auth/SignupRequestUseCase";
// import { SignupVerifyUseCase } from "@application/use-cases/auth/SignupVerifyUseCase";
// import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
// import { ResendOtpUseCase } from "@application/use-cases/auth/ResendOtpUseCase";
// import { UpdatePasswordUseCase } from "@application/use-cases/auth/UpdatePasswordUseCase";
// import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
// import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
// import { ForgotPasswordRequestUseCase } from "@application/use-cases/auth/ForgotPasswordRequestUseCase";
// import { ForgotPasswordVerifyUseCase } from "@application/use-cases/auth/ForgotPasswordVerifyUseCase";
// import { GoogleLoginUseCase } from "@application/use-cases/auth/GoogleLoginUseCase";
// import { GetGoogleAuthUrlUseCase } from "@application/use-cases/auth/GetGoogleAuthUrlUseCase";
// import { GetCurrentUserUseCase } from "@application/use-cases/auth/GetCurrentUserUseCase";
// import { RegisterDriverUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
// import { GetUsersUseCase } from "@application/use-cases/admin/GetUsersUseCase";
// import { UpdateUserStatusUseCase } from "@application/use-cases/admin/UpdateUserStatusUseCase";
// import { UploadFileUseCase } from "@application/use-cases/file/UploadFileUseCase";
// import { GetKycRequestByIdUseCase } from "@application/use-cases/admin/GetKycRequestByIdUseCase";

// // Controllers
// import { SignupController } from "@interface/controllers/auth/SignupController";
// import { LoginController } from "@interface/controllers/auth/LoginController";
// import { OtpController } from "@interface/controllers/auth/OtpController";
// import { PasswordController } from "@interface/controllers/auth/PasswordController";
// import { SocialAuthController } from "@interface/controllers/auth/SocialAuthController";
// import { UserController } from "@interface/controllers/auth/UserController";
// import { DriverController } from "@interface/controllers/driver/DriverController";
// import { AdminUserController } from "@interface/controllers/admin/AdminUserController";
// import { FileController } from "@interface/controllers/file/FileController";
// import { IAdminDriverRepository } from "@domain/repositories/admin/IAdminDriverRepository";
// import { MongoAdminDriverRepository } from "@infrastructure/database/repositories/admin/MongoAdminDriverRepository";
// import { IAdminKycRepository } from "@domain/repositories/admin/IAdminKycRepository";
// import { MongoAdminKycRepository } from "@infrastructure/database/repositories/admin/MongoAdminKycRepository";
// import { GetDriversUseCase } from "@application/use-cases/admin/GetDriversUseCase";
// import { DriverActionUseCase } from "@application/use-cases/admin/DriverActionUseCase";
// import { GetKycRequestsUseCase } from "@application/use-cases/admin/GetKycRequestsUseCase";
// import { UpdateKycStatusUseCase } from "@application/use-cases/admin/UpdateKycStatusUseCase";
// import { GetDriverProfileUseCase } from "@application/use-cases/admin/GetDriverProfileUseCase";
// import { AdminDriverController } from "@interface/controllers/admin/AdminDriverController";
// import { IUserProfileRepository } from "@domain/repositories/user/IUserProfileRepository";
// import { MongoUserProfileRepository } from "@infrastructure/database/repositories/user/MongoUserProfileRepository";
// import { UserProfileController } from "@interface/controllers/user/UserProfileController";
// import { GetUserProfileUseCase } from "@application/use-cases/user/GetUserProfileUseCase";
// import { UpdateUserProfileUseCase } from "@application/use-cases/user/UpdateUserProfileUseCase";

// const container = new Container();

// // Repository Bindings
// // container.bind<IUserRepository>("IUserRepository").to(MongoUserRepository);
// container
//   .bind<IRefreshTokenRepository>("IRefreshTokenRepository")
//   .to(MongoRefreshTokenRepository);
// container
//   .bind<IDriverRepository>("IDriverRepository")
//   .to(MongoDriverRepository);
// container
//   .bind<IDriverKycRepository>("IDriverKycRepository")
//   .to(MongoDriverKycRepository);
// container
//   .bind<IAdminUserRepository>("IAdminUserRepository")
//   .to(MongoAdminUserRepository);
// container
//   .bind<IAdminDriverRepository>("IAdminDriverRepository")
//   .to(MongoAdminDriverRepository);
// container
//   .bind<IAdminKycRepository>("IAdminKycRepository")
//   .to(MongoAdminKycRepository);
// container
//   .bind<IUserProfileRepository>("IUserProfileRepository")
//   .to(MongoUserProfileRepository);

// // Service Bindings
// container.bind<IPasswordService>("IPasswordService").to(BcryptPasswordService);
// container.bind<IEmailService>("IEmailService").to(NodemailerEmailService);
// container.bind<IOtpService>("IOtpService").to(OtpGeneratorService);
// container.bind<ITokenService>("ITokenService").to(JwtTokenService);
// container.bind<IGoogleAuthService>("IGoogleAuthService").to(GoogleAuthService);
// container.bind<IFileUploadService>("IFileUploadService").to(CloudinaryService);

// // Use Case Bindings
// [
//   SignupRequestUseCase,
//   SignupVerifyUseCase,
//   LoginUseCase,
//   ResendOtpUseCase,
//   UpdatePasswordUseCase,
//   RefreshTokenUseCase,
//   LogoutUseCase,
//   ForgotPasswordRequestUseCase,
//   ForgotPasswordVerifyUseCase,
//   GoogleLoginUseCase,
//   GetGoogleAuthUrlUseCase,
//   GetCurrentUserUseCase,
//   RegisterDriverUseCase,
//   GetUsersUseCase,
//   UpdateUserStatusUseCase,
//   UploadFileUseCase,
//   GetDriversUseCase,
//   DriverActionUseCase,
//   GetKycRequestsUseCase,
//   GetDriverProfileUseCase,
//   UpdateKycStatusUseCase,
//   GetKycRequestByIdUseCase,
//   GetUserProfileUseCase,
//   UpdateUserProfileUseCase,
// ].forEach((useCase) => container.bind(useCase).toSelf());

// // Controller Bindings
// container.bind<SignupController>(SignupController).toSelf();
// container.bind<LoginController>(LoginController).toSelf();
// container.bind<OtpController>(OtpController).toSelf();
// container.bind<PasswordController>(PasswordController).toSelf();
// container.bind<SocialAuthController>(SocialAuthController).toSelf();
// container.bind<UserController>(UserController).toSelf();
// container.bind<DriverController>(DriverController).toSelf();
// container.bind<AdminUserController>(AdminUserController).toSelf();
// container.bind<FileController>(FileController).toSelf();
// container.bind<AdminDriverController>(AdminDriverController).toSelf();
// container.bind(UserProfileController).toSelf();

// export { container };
