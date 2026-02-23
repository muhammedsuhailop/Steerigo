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
import { PasswordService } from "@infrastructure/services/PasswordService";
import { TokenService } from "@infrastructure/services/TokenService";
import { EmailService } from "@infrastructure/services/EmailService";
import { OtpService } from "@infrastructure/services/OtpService";
import { GoogleAuthService } from "@infrastructure/services/GoogleAuthService";
import { TokenManagementService } from "@infrastructure/services/TokenManagementService";
import {
  BcryptAdapter,
  CryptoAdapter,
} from "@infrastructure/adapters/CryptoAdapter";
import { IFileUploadService } from "@application/services/IFileUploadService";
import { CloudinaryService } from "@infrastructure/services/CloudinaryService";
import { AvailabilityCheckService } from "@infrastructure/services/AvailabilityCheckService";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { RedisLockService } from "@infrastructure/services/DistributedLockService";
import { IRideNotificationService } from "@application/services/IRideNotificationService";
import { RideNotificationService } from "@infrastructure/services/RideNotificationService";
import { IEventBus } from "@application/services/IEventBus";
import { InMemoryEventBus } from "@infrastructure/services/InMemoryEventBus";

export class ServiceFactory {
  static register(container: Container): void {
    // Bind Service Interfaces to Implementations
    container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService);
    container.bind<ITokenService>(TYPES.TokenService).to(TokenService);
    container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
    container.bind<IOtpService>(TYPES.OtpService).to(OtpService);
    container
      .bind<IGoogleAuthService>(TYPES.GoogleAuthService)
      .to(GoogleAuthService);
    container
      .bind<ITokenManagementService>(TYPES.TokenManagementService)
      .to(TokenManagementService);
    container
      .bind<CryptoAdapter>(TYPES.CryptoAdapter)
      .to(BcryptAdapter)
      .inSingletonScope();
    container
      .bind<IFileUploadService>(TYPES.FileUploadService)
      .to(CloudinaryService)
      .inSingletonScope();
    container
      .bind<AvailabilityCheckService>(TYPES.AvailabilityCheckService)
      .to(AvailabilityCheckService);
    container
      .bind<IDistributedLockService>(TYPES.DistributedLockService)
      .to(RedisLockService);
    container
      .bind<IRideNotificationService>(TYPES.RideNotificationService)
      .to(RideNotificationService)
      .inSingletonScope();

    container
      .bind<IEventBus>(TYPES.EventBus)
      .to(InMemoryEventBus)
      .inSingletonScope();
  }
}
