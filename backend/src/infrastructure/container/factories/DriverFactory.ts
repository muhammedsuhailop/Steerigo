import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Driver Repositories
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverRepositoryImpl } from "@infrastructure/database/repositories/DriverRepositoryImpl";

// Driver Use Cases
import { DriverRegistrationUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
// import { GetDriverProfileUseCase } from "@application/use-cases/driver/GetDriverProfileUseCase";
import { UpdateDriverProfileUseCase } from "@application/use-cases/driver/UpdateDriverProfileUseCase";
import { SubmitKYCUseCase } from "@application/use-cases/driver/SubmitKYCUseCase";
import { GetKYCStatusUseCase } from "@application/use-cases/driver/GetKYCStatusUseCase";

// Driver Controllers
import { DriverController } from "@interface/controllers/driver/DriverController";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { KYCRepositoryImpl } from "@infrastructure/database/repositories/KYCRepositoryImpl";

export class DriverFactory {
  static register(container: Container): void {
    // Repository bindings
    container
      .bind<DriverRepository>(TYPES.DriverRepository)
      .to(DriverRepositoryImpl);

    container.bind<KYCRepository>(TYPES.KYCRepository).to(KYCRepositoryImpl);

    // Use case bindings
    container
      .bind<DriverRegistrationUseCase>(TYPES.RegisterDriverUseCase)
      .to(DriverRegistrationUseCase);

    // container
    //   .bind<GetDriverProfileUseCase>(TYPES.GetDriverProfileUseCase)
    //   .to(GetDriverProfileUseCase);

    container
      .bind<UpdateDriverProfileUseCase>(TYPES.UpdateDriverProfileUseCase)
      .to(UpdateDriverProfileUseCase);

    container
      .bind<SubmitKYCUseCase>(TYPES.SubmitKYCUseCase)
      .to(SubmitKYCUseCase);

    container
      .bind<GetKYCStatusUseCase>(TYPES.GetKYCStatusUseCase)
      .to(GetKYCStatusUseCase);

    // Controller bindings
    container
      .bind<DriverController>(TYPES.DriverController)
      .to(DriverController);
  }
}
