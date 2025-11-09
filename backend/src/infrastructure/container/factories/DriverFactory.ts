import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Repository bindings are handled in AdminDriverFactory

// Driver Use Cases
import { DriverRegistrationUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { UpdateDriverProfileUseCase } from "@application/use-cases/driver/UpdateDriverProfileUseCase";
import { SubmitKYCUseCase } from "@application/use-cases/driver/SubmitKYCUseCase";
import { GetKYCStatusUseCase } from "@application/use-cases/driver/GetKYCStatusUseCase";

// Driver Controllers
import { DriverController } from "@interface/controllers/driver/DriverController";
import { DriverDashboardRepository } from "@application/repositories/DriverDashboardRepository";
import { DriverDashboardRepositoryImpl } from "@infrastructure/database/repositories/driver/DriverDashboardRepositoryImpl";
import { GetDriverDashboardUseCase } from "@application/use-cases/driver/GetDriverDashboardUseCase";
import { GetDriverStatusUseCase } from "@application/use-cases/driver/GetDriverStatusUseCase";
import { GetDriverDetailedProfileUseCase } from "@application/use-cases/driver/GetDriverDetailedProfileUseCase";

export class DriverFactory {
  static register(container: Container): void {
    container
      .bind<DriverDashboardRepository>(TYPES.DriverDashboardRepository)
      .to(DriverDashboardRepositoryImpl)
      .inSingletonScope();
    // Use case bindings
    container.bind(TYPES.RegisterDriverUseCase).to(DriverRegistrationUseCase);
    container
      .bind(TYPES.UpdateDriverProfileUseCase)
      .to(UpdateDriverProfileUseCase);
    container.bind(TYPES.SubmitKYCUseCase).to(SubmitKYCUseCase);
    container.bind(TYPES.GetKYCStatusUseCase).to(GetKYCStatusUseCase);
    container
      .bind(TYPES.GetDriverDashboardUseCase)
      .to(GetDriverDashboardUseCase);
    container
      .bind<GetDriverStatusUseCase>(TYPES.GetDriverStatusUseCase)
      .to(GetDriverStatusUseCase);
    container
      .bind<GetDriverDetailedProfileUseCase>(
        TYPES.GetDriverDetailedProfileUseCase
      )
      .to(GetDriverDetailedProfileUseCase);

    // Controller bindings
    container.bind(TYPES.DriverController).to(DriverController);
  }
}
