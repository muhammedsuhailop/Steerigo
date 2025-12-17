import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Repository
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { DriverAvailabilityRepositoryImpl } from "@infrastructure/database/repositories/DriverAvailabilityRepositoryImpl";

// Use Cases
import { ScheduleAvailabilityUseCase } from "@application/use-cases/driver/ScheduleAvailabilityUseCase";
import { UpdateAvailabilityStatusUseCase } from "@application/use-cases/driver/UpdateAvailabilityStatusUseCase";
import { UpdateDriverLocationUseCase } from "@application/use-cases/driver/UpdateDriverLocationUseCase";

// Controller
import { DriverAvailabilityController } from "@interface/controllers/driver/DriverAvailabilityController";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  ScheduleAvailabilityRequestDto,
  UpdateLocationRequestDto,
  UpdateStatusRequestDto,
} from "@application/dto/driver";
import { DriverAvailabilityResponseDto } from "@application/dto/driver/DriverAvailabilityResponseDto";
import { Result } from "@shared/utils/Result";
import { UpdateAvailabilityStatusResponseDto } from "@application/dto/driver/UpdateAvailabilityStatusResponseDto";
import { UpdateDriverLocationResponseDto } from "@application/dto/driver/UpdateDriverLocationResponseDto";

export class DriverAvailabilityFactory {
  static register(container: Container): void {
    // Repository
    container
      .bind<IDriverAvailabilityRepository>(TYPES.DriverAvailabilityRepository)
      .to(DriverAvailabilityRepositoryImpl);

    // Use Cases
    container
      .bind<
        IUseCase<
          ScheduleAvailabilityRequestDto,
          Promise<Result<DriverAvailabilityResponseDto>>
        >
      >(TYPES.ScheduleAvailabilityUseCase)
      .to(ScheduleAvailabilityUseCase);

    container
      .bind<
        IUseCase<
          UpdateStatusRequestDto,
          Promise<Result<UpdateAvailabilityStatusResponseDto>>
        >
      >(TYPES.UpdateAvailabilityStatusUseCase)
      .to(UpdateAvailabilityStatusUseCase);

    container
      .bind<
        IUseCase<
          UpdateLocationRequestDto,
          Promise<Result<UpdateDriverLocationResponseDto>>
        >
      >(TYPES.UpdateDriverLocationUseCase)
      .to(UpdateDriverLocationUseCase);

    // Controller
    container
      .bind<DriverAvailabilityController>(TYPES.DriverAvailabilityController)
      .to(DriverAvailabilityController);
  }
}
