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
import { IDriverDashboardRepository } from "@domain/repositories/IDriverDashboardRepository";
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
import { EditAvailabilityExceptionRequestDto } from "@application/dto/driver/EditAvailabilityExceptionRequestDto";
import { EditAvailabilityExceptionResponseDto } from "@application/dto/driver/EditAvailabilityExceptionResponseDto";
import { EditAvailabilityExceptionUseCase } from "@application/use-cases/driver/EditAvailabilityExceptionUseCase";
import { RemoveAvailabilityExceptionRequestDto } from "@application/dto/driver/RemoveAvailabilityExceptionRequestDto";
import { RemoveAvailabilityExceptionResponseDto } from "@application/dto/driver/RemoveAvailabilityExceptionResponseDto";
import { RemoveAvailabilityExceptionUseCase } from "@application/use-cases/driver/RemoveAvailabilityExceptionUseCase";
import { AcceptRideRequestDto } from "@application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "@application/dto/driver/AcceptRideRequestResponseDto";
import { AcceptRideRequestUseCase } from "@application/use-cases/driver/AcceptRideRequestUseCase";
import { RejectRideRequestDto } from "@application/dto/driver/RejectRideRequestDto";
import { RejectRideRequestResponseDto } from "@application/dto/driver/RejectRideRequestResponseDto";
import { RejectRideRequestUseCase } from "@application/use-cases/driver/RejectRideRequestUseCase";
import { GetPendingRideRequestsUseCase } from "@application/use-cases/driver/GetPendingRideRequestsUseCase";
import { GetPendingRideRequestsDto } from "@application/dto/driver/GetPendingRideRequestsDto";
import { GetPendingRideRequestsResponseDto } from "@application/dto/driver/GetPendingRideRequestsResponseDto";
import { GetDriverRidesDto } from "@application/dto/driver/GetDriverRidesDto";
import { GetDriverRidesResponseDto } from "@application/dto/driver/GetDriverRidesResponseDto";
import { GetDriverRidesUseCase } from "@application/use-cases/driver/GetDriverRidesUseCase";
import { GetDriverRideByIdDto } from "@application/dto/driver/GetDriverRideByIdDto";
import { GetDriverRideByIdResponseDto } from "@application/dto/driver/GetDriverRideByIdResponseDto";
import { GetDriverRideByIdUseCase } from "@application/use-cases/driver/GetDriverRideByIdUseCase";
import { MarkRideAsArrivedDto } from "@application/dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "@application/dto/driver/MarkRideAsArrivedResponseDto";
import { MarkRideAsArrivedUseCase } from "@application/use-cases/driver/MarkRideAsArrivedUseCase";
import { MarkRideAsStartedDto } from "@application/dto/driver/MarkRideAsStartedDto";
import { MarkRideAsStartedResponseDto } from "@application/dto/driver/MarkRideAsStartedResponseDto";
import { MarkRideAsStartedUseCase } from "@application/use-cases/driver/MarkRideAsStartedUseCase";
import { MarkRideAsCompletedDto } from "@application/dto/driver/MarkRideAsCompletedDto";
import { MarkRideAsCompletedResponseDto } from "@application/dto/driver/MarkRideAsCompletedResponseDto";
import { MarkRideAsCompletedUseCase } from "@application/use-cases/driver/MarkRideAsCompletedUseCase";
import { RequestPayoutUseCase } from "@application/use-cases/driver/RequestPayoutUseCase";
import { GetDriverPayoutsUseCase } from "@application/use-cases/driver/GetDriverPayoutsUseCase";
import { GetDriverWalletUseCase } from "@application/use-cases/driver/GetDriverWalletUseCase";
import { DriverWalletController } from "@interface/controllers/driver/DriverWalletController";
import { DriverCancelRideDto } from "@application/dto/driver/DriverCancelRideDto";
import { DriverCancelRideResponseDto } from "@application/dto/driver/DriverCancelRideResponseDto";
import { DriverCancelRideUseCase } from "@application/use-cases/driver/DriverCancelRideUseCase";

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
    container
      .bind<
        IUseCase<
          EditAvailabilityExceptionRequestDto,
          Promise<Result<EditAvailabilityExceptionResponseDto>>
        >
      >(TYPES.EditAvailabilityExceptionUseCase)
      .to(EditAvailabilityExceptionUseCase);
    container
      .bind<
        IUseCase<
          RemoveAvailabilityExceptionRequestDto,
          Promise<Result<RemoveAvailabilityExceptionResponseDto>>
        >
      >(TYPES.RemoveAvailabilityExceptionUseCase)
      .to(RemoveAvailabilityExceptionUseCase);

    container
      .bind<
        IUseCase<
          AcceptRideRequestDto,
          Promise<Result<AcceptRideRequestResponseDto>>
        >
      >(TYPES.AcceptRideRequestUseCase)
      .to(AcceptRideRequestUseCase);

    container
      .bind<
        IUseCase<
          RejectRideRequestDto,
          Promise<Result<RejectRideRequestResponseDto>>
        >
      >(TYPES.RejectRideRequestUseCase)
      .to(RejectRideRequestUseCase);

    container
      .bind<
        IUseCase<
          GetPendingRideRequestsDto,
          Promise<Result<GetPendingRideRequestsResponseDto>>
        >
      >(TYPES.GetPendingRideRequestsUseCase)
      .to(GetPendingRideRequestsUseCase);

    container
      .bind<
        IUseCase<GetDriverRidesDto, Promise<Result<GetDriverRidesResponseDto>>>
      >(TYPES.GetDriverRidesUseCase)
      .to(GetDriverRidesUseCase);

    container
      .bind<
        IUseCase<
          GetDriverRideByIdDto,
          Promise<Result<GetDriverRideByIdResponseDto>>
        >
      >(TYPES.GetDriverRideByIdUseCase)
      .to(GetDriverRideByIdUseCase);

    container
      .bind<
        IUseCase<
          MarkRideAsArrivedDto,
          Promise<Result<MarkRideAsArrivedResponseDto>>
        >
      >(TYPES.MarkRideAsArrivedUseCase)
      .to(MarkRideAsArrivedUseCase);

    container
      .bind<
        IUseCase<
          MarkRideAsStartedDto,
          Promise<Result<MarkRideAsStartedResponseDto>>
        >
      >(TYPES.MarkRideAsStartedUseCase)
      .to(MarkRideAsStartedUseCase);

    container
      .bind<
        IUseCase<
          MarkRideAsCompletedDto,
          Promise<Result<MarkRideAsCompletedResponseDto>>
        >
      >(TYPES.MarkRideAsCompletedUseCase)
      .to(MarkRideAsCompletedUseCase);
    container.bind(TYPES.RequestPayoutUseCase).to(RequestPayoutUseCase);
    container.bind(TYPES.GetDriverPayoutsUseCase).to(GetDriverPayoutsUseCase);
    container.bind(TYPES.GetDriverWalletUseCase).to(GetDriverWalletUseCase);
    container
      .bind<
        IUseCase<
          DriverCancelRideDto,
          Promise<Result<DriverCancelRideResponseDto>>
        >
      >(TYPES.DriverCancelRideUseCase)
      .to(DriverCancelRideUseCase);

    // Controller bindings
    container.bind(TYPES.DriverController).to(DriverController);
    container.bind(TYPES.DriverWalletController).to(DriverWalletController);
  }
}
