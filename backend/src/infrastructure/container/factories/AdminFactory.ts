import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Admin Repositories
import { IAdminUserRepository } from "@domain/repositories/IAdminUserRepository";
import { AdminUserRepositoryImpl } from "@infrastructure/database/repositories/AdminUserRepositoryImpl";

// Admin Use Cases
import { GetUsersUseCase } from "@application/use-cases/admin/GetUsersUseCase";
import { UpdateUserStatusUseCase } from "@application/use-cases/admin/UpdateUserStatusUseCase";

// Admin Controllers
import { AdminUserController } from "@interface/controllers/admin/AdminUserController";
import { UpdateUserStatusResponseDto } from "@application/dto/admin";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetUsersRequestDto } from "@application/dto/admin/GetUsersRequestDto";
import { GetUsersResponseDto } from "@application/dto/admin/GetUsersResponseDto";
import { UpdateUserStatusRequestDto } from "@application/dto/admin/UpdateUserStatusRequestDto";
import { GetUserProfileRequestDto } from "@application/dto/admin/GetUserProfileRequestDto";
import { GetUserProfileResponseDto } from "@application/dto/admin/GetUserProfileResponseDto";
import { GetUserProfileDetailsUseCase } from "@application/use-cases/admin/GetUserProfileDetailsUseCase";
import { GetAdminRidesUseCase } from "@application/use-cases/admin/GetAdminRidesUseCase";
import { AdminRideController } from "@interface/controllers/admin/AdminRideController";
import { ApprovePayoutUseCase } from "@application/use-cases/admin/ApprovePayoutUseCase";
import { RejectPayoutUseCase } from "@application/use-cases/admin/RejectPayoutUseCase";
import { GetAdminPayoutsUseCase } from "@application/use-cases/admin/GetAdminPayoutsUseCase";

export class AdminFactory {
  static register(container: Container): void {
    // Repository bindings
    container
      .bind<IAdminUserRepository>(TYPES.AdminUserRepository)
      .to(AdminUserRepositoryImpl);

    // Use case bindings
    container
      .bind<
        IUseCase<GetUsersRequestDto, Promise<Result<GetUsersResponseDto>>>
      >(TYPES.GetUsersUseCase)
      .to(GetUsersUseCase);
    container
      .bind<
        IUseCase<
          UpdateUserStatusRequestDto,
          Promise<Result<UpdateUserStatusResponseDto>>
        >
      >(TYPES.UpdateUserStatusUseCase)
      .to(UpdateUserStatusUseCase);

    container
      .bind<
        IUseCase<
          GetUserProfileRequestDto,
          Promise<Result<GetUserProfileResponseDto>>
        >
      >(TYPES.GetUserProfileDetailsUseCase)
      .to(GetUserProfileDetailsUseCase);

    container
      .bind<GetAdminRidesUseCase>(TYPES.GetAdminRidesUseCase)
      .to(GetAdminRidesUseCase);
    container.bind(TYPES.ApprovePayoutUseCase).to(ApprovePayoutUseCase);
    container.bind(TYPES.RejectPayoutUseCase).to(RejectPayoutUseCase);
    container.bind(TYPES.GetAdminPayoutsUseCase).to(GetAdminPayoutsUseCase);

    // Controller bindings
    container
      .bind<AdminUserController>(TYPES.AdminUserController)
      .to(AdminUserController);

    container
      .bind<AdminRideController>(TYPES.AdminRideController)
      .to(AdminRideController);
  }
}
