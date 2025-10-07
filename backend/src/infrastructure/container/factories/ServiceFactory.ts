import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Application Service Interfaces
import { PasswordService } from "@application/services/PasswordService";
import { TokenService } from "@application/services/TokenService";
import { EmailService } from "@application/services/EmailService";
import { OtpService } from "@application/services/OtpService";
import { GoogleAuthService } from "@application/services/GoogleAuthService";
import { TokenManagementService } from "@application/services/TokenManagementService";

// Infrastructure Service Implementations
import { PasswordServiceImpl } from "@infrastructure/services/PasswordServiceImpl";
import { TokenServiceImpl } from "@infrastructure/services/TokenServiceImpl";
import { EmailServiceImpl } from "@infrastructure/services/EmailServiceImpl";
import { OtpServiceImpl } from "@infrastructure/services/OtpServiceImpl";
import { GoogleAuthServiceImpl } from "@infrastructure/services/GoogleAuthServiceImpl";
import { TokenManagementServiceImpl } from "@infrastructure/services/TokenManagementServiceImpl";

export class ServiceFactory {
  static register(container: Container): void {
    // Bind Service Interfaces to Implementations
    container
      .bind<PasswordService>(TYPES.PasswordService)
      .to(PasswordServiceImpl);
    container.bind<TokenService>(TYPES.TokenService).to(TokenServiceImpl);
    container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl);
    container.bind<OtpService>(TYPES.OtpService).to(OtpServiceImpl);
    container
      .bind<GoogleAuthService>(TYPES.GoogleAuthService)
      .to(GoogleAuthServiceImpl);
    container
      .bind<TokenManagementService>(TYPES.TokenManagementService)
      .to(TokenManagementServiceImpl);
  }
}
