import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { DriverAvailabilityRepositoryImpl } from "@infrastructure/database/repositories/DriverAvailabilityRepositoryImpl";
import { UpdateAvailabilityStatusUseCase } from "@application/use-cases/driver/UpdateAvailabilityStatusUseCase";
import { UpdateDriverLocationUseCase } from "@application/use-cases/driver/UpdateDriverLocationUseCase";
import { DriverAvailabilityController } from "@interface/controllers/driver/DriverAvailabilityController";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  ScheduleRecurringAvailabilityRequestDto,
  UpdateLocationRequestDto,
  UpdateStatusRequestDto,
} from "@application/dto/driver";
import { DriverAvailabilityResponseDto } from "@application/dto/driver/DriverAvailabilityResponseDto";
import { Result } from "@shared/utils/Result";
import { UpdateAvailabilityStatusResponseDto } from "@application/dto/driver/UpdateAvailabilityStatusResponseDto";
import { UpdateDriverLocationResponseDto } from "@application/dto/driver/UpdateDriverLocationResponseDto";
import { ScheduleRecurringAvailabilityUseCase } from "@application/use-cases/driver/ScheduleRecurringAvailabilityUseCase";
import { AddAvailabilityExceptionRequestDto } from "@application/dto/driver/AddAvailabilityExceptionRequestDto";
import { AddAvailabilityExceptionUseCase } from "@application/use-cases/driver/AddAvailabilityExceptionUseCase";
import { AddAvailabilityExceptionResponseDto } from "@application/dto/driver/AddAvailabilityExceptionResponseDto";
import { UpdateBaseLocationRequestDto } from "@application/dto/driver/UpdateBaseLocationRequestDto";
import { UpdateDriverBaseLocationResponseDto } from "@application/dto/driver/UpdateDriverBaseLocationResponseDto";
import { UpdateDriverBaseLocationUseCase } from "@application/use-cases/driver/UpdateDriverBaseLocationUseCase";

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
          ScheduleRecurringAvailabilityRequestDto,
          Promise<Result<DriverAvailabilityResponseDto>>
        >
      >(TYPES.ScheduleRecurringAvailabilityUseCase)
      .to(ScheduleRecurringAvailabilityUseCase);

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

    container
      .bind<
        IUseCase<
          AddAvailabilityExceptionRequestDto,
          Promise<Result<AddAvailabilityExceptionResponseDto>>
        >
      >(TYPES.AddAvailabilityExceptionUseCase)
      .to(AddAvailabilityExceptionUseCase);

    container
      .bind<
        IUseCase<
          UpdateBaseLocationRequestDto,
          Promise<Result<UpdateDriverBaseLocationResponseDto>>
        >
      >(TYPES.UpdateDriverBaseLocationUseCase)
      .to(UpdateDriverBaseLocationUseCase);

    // Controller
    container
      .bind<DriverAvailabilityController>(TYPES.DriverAvailabilityController)
      .to(DriverAvailabilityController);
  }
}
