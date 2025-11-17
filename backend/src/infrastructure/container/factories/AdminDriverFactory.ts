import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

import { DriverRepository } from "@application/repositories/DriverRepository";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { DriverRepositoryImpl } from "@infrastructure/database/repositories/DriverRepositoryImpl";

import { KYCRepository } from "@application/repositories/KYCRepository";
import { KYCRepository as AdminKYCRepository } from "@application/repositories/AdminDriverKYCRepository";
import { KYCRepositoryImpl } from "@infrastructure/database/repositories/KYCRepositoryImpl";

// Admin Driver Use Cases
import { GetDriversUseCase } from "@application/use-cases/admin/GetDriversUseCase";
import { DriverActionUseCase } from "@application/use-cases/admin/DriverActionUseCase";
import { GetDriverProfileUseCase } from "@application/use-cases/admin/GetDriverProfileUseCase";
import { GetKycRequestsUseCase } from "@application/use-cases/admin/GetKycRequestsUseCase";
import { UpdateKycStatusUseCase } from "@application/use-cases/admin/UpdateKycStatusUseCase";
import { GetKycRequestByIdUseCase } from "@application/use-cases/admin/GetKycRequestByIdUseCase";

// Admin Driver Controllers
import { AdminDriverController } from "@interface/controllers/admin/AdminDriverController";
import { UpdateDriverKycStatusUseCase } from "@application/use-cases/admin/UpdateDriverKycStatusUseCase";

export class AdminDriverFactory {
  static register(container: Container): void {
    container
      .bind<DriverRepository>(TYPES.DriverRepository)
      .to(DriverRepositoryImpl)
      .inSingletonScope();

    container
      .bind<AdminDriverRepository>(TYPES.AdminDriverRepository)
      .toService(TYPES.DriverRepository);

    container
      .bind<KYCRepository>(TYPES.KYCRepository)
      .to(KYCRepositoryImpl)
      .inSingletonScope();

    container
      .bind<AdminKYCRepository>(TYPES.AdminKYCRepository)
      .toService(TYPES.KYCRepository);

    // Use case bindings
    container.bind(TYPES.GetDriversUseCase).to(GetDriversUseCase);
    container.bind(TYPES.DriverActionUseCase).to(DriverActionUseCase);
    container.bind(TYPES.GetDriverProfileUseCase).to(GetDriverProfileUseCase);
    container.bind(TYPES.GetKycRequestsUseCase).to(GetKycRequestsUseCase);
    container.bind(TYPES.UpdateKycStatusUseCase).to(UpdateKycStatusUseCase);
    container.bind(TYPES.GetKycRequestByIdUseCase).to(GetKycRequestByIdUseCase);
    container
      .bind(TYPES.UpdateDriverKycStatusUseCase)
      .to(UpdateDriverKycStatusUseCase);

    // Controller bindings
    container.bind(TYPES.AdminDriverController).to(AdminDriverController);
  }
}
