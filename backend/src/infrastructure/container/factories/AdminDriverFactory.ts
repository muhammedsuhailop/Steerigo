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
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  AdminGetDriverProfileResponseDto,
  DriverActionRequestDto,
  GetDriverProfileRequestDto,
  GetDriversRequestDto,
  GetDriversResponseDto,
  GetKycRequestByIdRequestDto,
  GetKycRequestsRequestDto,
} from "@application/dto/admin";
import { Result } from "@shared/utils/Result";
import { GetKycRequestByIdResponseDto } from "@application/dto/admin/GetKycRequestByIdResponseDto";
import { GetKycRequestsResponseDto } from "@application/dto/admin/GetKycRequestsResponseDto";
import { UpdateKycStatusRequestDto } from "@application/dto/admin/UpdateKycStatusRequestDto";
import { UpdateDriverKycStatusRequestDto } from "@application/dto/admin/UpdateDriverKycStatusRequestDto";
import { UpdateDriverKycStatusResponseDto } from "@application/dto/admin/UpdateDriverKycStatusResponseDto";

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
    container
      .bind<
        IUseCase<GetDriversRequestDto, Promise<Result<GetDriversResponseDto>>>
      >(TYPES.GetDriversUseCase)
      .to(GetDriversUseCase);
    container
      .bind<
        IUseCase<
          DriverActionRequestDto,
          Promise<
            Result<{
              message: string;
              driverId: string;
              newStatus: string;
            }>
          >
        >
      >(TYPES.DriverActionUseCase)
      .to(DriverActionUseCase);
    container
      .bind<
        IUseCase<
          GetDriverProfileRequestDto,
          Promise<Result<AdminGetDriverProfileResponseDto>>
        >
      >(TYPES.GetDriverProfileUseCase)
      .to(GetDriverProfileUseCase);
    container
      .bind<
        IUseCase<
          GetKycRequestsRequestDto,
          Promise<Result<GetKycRequestsResponseDto>>
        >
      >(TYPES.GetKycRequestsUseCase)
      .to(GetKycRequestsUseCase);
    container
      .bind<
        IUseCase<
          UpdateKycStatusRequestDto,
          Promise<
            Result<{
              message: string;
              kycDocument: any;
              driverKycStatusUpdated: boolean;
            }>
          >
        >
      >(TYPES.UpdateKycStatusUseCase)
      .to(UpdateKycStatusUseCase);
    container
      .bind<
        IUseCase<
          GetKycRequestByIdRequestDto,
          Promise<Result<GetKycRequestByIdResponseDto>>
        >
      >(TYPES.GetKycRequestByIdUseCase)
      .to(GetKycRequestByIdUseCase);
    container
      .bind<
        IUseCase<
          UpdateDriverKycStatusRequestDto,
          Promise<Result<UpdateDriverKycStatusResponseDto>>
        >
      >(TYPES.UpdateDriverKycStatusUseCase)
      .to(UpdateDriverKycStatusUseCase);

    // Controller bindings
    container.bind(TYPES.AdminDriverController).to(AdminDriverController);
  }
}
