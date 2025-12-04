import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Application Service Interfaces
import { IPasswordService } from "@application/services/IPasswordService";
import { ITokenService } from "@application/services/ITokenService";
import { IEmailService } from "@application/services/IEmailService";
import { IOtpService } from "@application/services/IOtpService";
import { IGoogleAuthService } from "@application/services/IGoogleAuthService";
import { ITokenManagementService } from "@application/services/ITokenManagementService";

// Infrastructure Service Implementations
import { PasswordServiceImpl } from "@infrastructure/services/PasswordServiceImpl";
import { TokenServiceImpl } from "@infrastructure/services/TokenServiceImpl";
import { EmailServiceImpl } from "@infrastructure/services/EmailServiceImpl";
import { OtpServiceImpl } from "@infrastructure/services/OtpServiceImpl";
import { GoogleAuthServiceImpl } from "@infrastructure/services/GoogleAuthServiceImpl";
import { TokenManagementServiceImpl } from "@infrastructure/services/TokenManagementServiceImpl";
import {
  BcryptAdapter,
  CryptoAdapter,
} from "@infrastructure/adapters/CryptoAdapter";
import { IFileUploadService } from "@application/services/IFileUploadService";
import { CloudinaryService } from "@infrastructure/services/CloudinaryService";

export class ServiceFactory {
  static register(container: Container): void {
    // Bind Service Interfaces to Implementations
    container
      .bind<IPasswordService>(TYPES.PasswordService)
      .to(PasswordServiceImpl);
    container.bind<ITokenService>(TYPES.TokenService).to(TokenServiceImpl);
    container.bind<IEmailService>(TYPES.EmailService).to(EmailServiceImpl);
    container.bind<IOtpService>(TYPES.OtpService).to(OtpServiceImpl);
    container
      .bind<IGoogleAuthService>(TYPES.GoogleAuthService)
      .to(GoogleAuthServiceImpl);
    container
      .bind<ITokenManagementService>(TYPES.TokenManagementService)
      .to(TokenManagementServiceImpl);
    container
      .bind<CryptoAdapter>(TYPES.CryptoAdapter)
      .to(BcryptAdapter)
      .inSingletonScope();
    container
      .bind<IFileUploadService>(TYPES.FileUploadService)
      .to(CloudinaryService)
      .inSingletonScope();
  }
}
