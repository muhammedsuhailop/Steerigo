import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Repository
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { DriverAvailabilityRepositoryImpl } from "@infrastructure/database/repositories/DriverAvailabilityRepositoryImpl";

// Use Cases
import { ScheduleAvailabilityUseCase } from "@application/use-cases/driver/ScheduleAvailabilityUseCase";
import { UpdateAvailabilityStatusUseCase } from "@application/use-cases/driver/UpdateAvailabilityStatusUseCase";
import { UpdateDriverLocationUseCase } from "@application/use-cases/driver/UpdateDriverLocationUseCase";

// Controller
import { DriverAvailabilityController } from "@interface/controllers/driver/DriverAvailabilityController";

export class DriverAvailabilityFactory {
  static register(container: Container): void {
    // Repository
    container
      .bind<DriverAvailabilityRepository>(TYPES.DriverAvailabilityRepository)
      .to(DriverAvailabilityRepositoryImpl);

    // Use Cases
    container
      .bind<ScheduleAvailabilityUseCase>(TYPES.ScheduleAvailabilityUseCase)
      .to(ScheduleAvailabilityUseCase);

    container
      .bind<UpdateAvailabilityStatusUseCase>(
        TYPES.UpdateAvailabilityStatusUseCase
      )
      .to(UpdateAvailabilityStatusUseCase);

    container
      .bind<UpdateDriverLocationUseCase>(TYPES.UpdateDriverLocationUseCase)
      .to(UpdateDriverLocationUseCase);

    // Controller
    container
      .bind<DriverAvailabilityController>(TYPES.DriverAvailabilityController)
      .to(DriverAvailabilityController);
  }
}
