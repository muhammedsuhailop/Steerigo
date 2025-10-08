import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Admin Driver Repositories
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { AdminDriverRepositoryImpl } from "@infrastructure/database/repositories/AdminDriverRepositoryImpl";
import { KYCRepository } from "@application/repositories/KYCRepository";
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

export class AdminDriverFactory {
  static register(container: Container): void {
    // Repository bindings
    container
      .bind<AdminDriverRepository>(TYPES.AdminDriverRepository)
      .to(AdminDriverRepositoryImpl);

    container.bind<KYCRepository>(TYPES.KYCRepository).to(KYCRepositoryImpl);

    // Use case bindings
    container
      .bind<GetDriversUseCase>(TYPES.GetDriversUseCase)
      .to(GetDriversUseCase);

    container
      .bind<DriverActionUseCase>(TYPES.DriverActionUseCase)
      .to(DriverActionUseCase);

    container
      .bind<GetDriverProfileUseCase>(TYPES.GetDriverProfileUseCase)
      .to(GetDriverProfileUseCase);

    container
      .bind<GetKycRequestsUseCase>(TYPES.GetKycRequestsUseCase)
      .to(GetKycRequestsUseCase);

    container
      .bind<UpdateKycStatusUseCase>(TYPES.UpdateKycStatusUseCase)
      .to(UpdateKycStatusUseCase);

    container
      .bind<GetKycRequestByIdUseCase>(TYPES.GetKycRequestByIdUseCase)
      .to(GetKycRequestByIdUseCase);

    // Controller bindings
    container
      .bind<AdminDriverController>(TYPES.AdminDriverController)
      .to(AdminDriverController);
  }
}
