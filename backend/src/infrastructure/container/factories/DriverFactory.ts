import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Repository bindings are handled in AdminDriverFactory

// Driver Use Cases
import {
  DriverRegistrationUseCase,
  RegisterDriverResult,
} from "@application/use-cases/driver/RegisterDriverUseCase";
import { UpdateDriverProfileUseCase } from "@application/use-cases/driver/UpdateDriverProfileUseCase";
import { SubmitKYCUseCase } from "@application/use-cases/driver/SubmitKYCUseCase";
import { GetKYCStatusUseCase } from "@application/use-cases/driver/GetKYCStatusUseCase";

// Driver Controllers
import { DriverController } from "@interface/controllers/driver/DriverController";
import { IDriverDashboardRepository } from "@application/repositories/IDriverDashboardRepository";
import { DriverDashboardRepositoryImpl } from "@infrastructure/database/repositories/driver/DriverDashboardRepositoryImpl";
import { GetDriverDashboardUseCase } from "@application/use-cases/driver/GetDriverDashboardUseCase";
import { GetDriverStatusUseCase } from "@application/use-cases/driver/GetDriverStatusUseCase";
import { GetDriverDetailedProfileUseCase } from "@application/use-cases/driver/GetDriverDetailedProfileUseCase";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { Result } from "@shared/utils/Result";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { UpdateDriverProfileResponseDto } from "@application/dto/driver/UpdateDriverProfileResponseDto";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { SubmitKYCResponseDto } from "@application/dto/driver/SubmitKYCResponseDto";
import { KYCResponseDto } from "@application/dto/driver/KYCResponseDto";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { DriverStatusResponseDto } from "@application/dto/driver/DriverStatusResponseDto";
import { GetDriverProfileResponseDto } from "@application/dto/driver/GetDriverProfileResponseDto";
import { GetDriverProfileRequestDto } from "@application/dto/driver/GetDriverProfileRequestDto";

export class DriverFactory {
  static register(container: Container): void {
    container
      .bind<IDriverDashboardRepository>(TYPES.DriverDashboardRepository)
      .to(DriverDashboardRepositoryImpl)
      .inSingletonScope();
    // Use case bindings
    container
      .bind<
        IUseCase<
          DriverRegistrationRequestDto,
          Promise<Result<RegisterDriverResult>>
        >
      >(TYPES.RegisterDriverUseCase)
      .to(DriverRegistrationUseCase);
    container
      .bind<
        IUseCase<
          DriverProfileUpdateDto,
          Promise<Result<UpdateDriverProfileResponseDto>>
        >
      >(TYPES.UpdateDriverProfileUseCase)
      .to(UpdateDriverProfileUseCase);
    container
      .bind<
        IUseCase<KYCSubmissionRequestDto, Promise<Result<SubmitKYCResponseDto>>>
      >(TYPES.SubmitKYCUseCase)
      .to(SubmitKYCUseCase);
    container
      .bind<
        IUseCase<string, Promise<Result<KYCResponseDto[]>>>
      >(TYPES.GetKYCStatusUseCase)
      .to(GetKYCStatusUseCase);
    container
      .bind<
        IUseCase<
          GetDriverDashboardDto,
          Promise<Result<DriverDashboardResponseDto>>
        >
      >(TYPES.GetDriverDashboardUseCase)
      .to(GetDriverDashboardUseCase);
    container
      .bind<
        IUseCase<string, Promise<Result<DriverStatusResponseDto>>>
      >(TYPES.GetDriverStatusUseCase)
      .to(GetDriverStatusUseCase);
    container
      .bind<
        IUseCase<
          GetDriverProfileRequestDto,
          Promise<Result<GetDriverProfileResponseDto>>
        >
      >(TYPES.GetDriverDetailedProfileUseCase)
      .to(GetDriverDetailedProfileUseCase);

    // Controller bindings
    container.bind(TYPES.DriverController).to(DriverController);
  }
}
