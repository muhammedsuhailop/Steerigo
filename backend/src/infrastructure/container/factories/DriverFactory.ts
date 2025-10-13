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

export class DriverFactory {
  static register(container: Container): void {
    // Use case bindings
    container.bind(TYPES.RegisterDriverUseCase).to(DriverRegistrationUseCase);
    container
      .bind(TYPES.UpdateDriverProfileUseCase)
      .to(UpdateDriverProfileUseCase);
    container.bind(TYPES.SubmitKYCUseCase).to(SubmitKYCUseCase);
    container.bind(TYPES.GetKYCStatusUseCase).to(GetKYCStatusUseCase);

    // Controller bindings
    container.bind(TYPES.DriverController).to(DriverController);
  }
}
