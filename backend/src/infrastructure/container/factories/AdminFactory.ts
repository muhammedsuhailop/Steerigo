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
import { CreateCouponDto } from "@application/dto/admin/CreateCouponDto";
import { CreateCouponResponseDto } from "@application/dto/admin/CreateCouponResponseDto";
import { CreateCouponUseCase } from "@application/use-cases/admin/CreateCouponUseCase";
import { EditCouponDto } from "@application/dto/admin/EditCouponDto";
import { EditCouponResponseDto } from "@application/dto/admin/EditCouponResponseDto";
import { EditCouponUseCase } from "@application/use-cases/admin/EditCouponUseCase";
import { AdminCouponController } from "@interface/controllers/admin/AdminCouponController";
import { GetAdminCouponsDto } from "@application/dto/admin/GetAdminCouponsDto";
import { GetAdminCouponsResponseDto } from "@application/dto/admin/GetAdminCouponsResponseDto";
import { GetAdminCouponsUseCase } from "@application/use-cases/admin/GetAdminCouponsUseCase";
import { GetAdminRatingsDto } from "@application/dto/admin/GetAdminRatingsDto";
import { GetAdminRatingsResponseDto } from "@application/dto/admin/GetAdminRatingsResponseDto";
import { GetAdminRatingsUseCase } from "@application/use-cases/admin/GetAdminRatingsUseCase";
import { GetAdminTransactionsDto } from "@application/dto/admin/GetAdminTransactionsDto";
import { GetAdminTransactionsResponseDto } from "@application/dto/admin/GetAdminTransactionsResponseDto";
import { GetAdminTransactionsUseCase } from "@application/use-cases/admin/GetAdminTransactionsUseCase";
import { AdminTransactionController } from "@interface/controllers/admin/AdminTransactionController";
import { GetAdminRideByIdDto } from "@application/dto/admin/GetAdminRideByIdDto";
import { GetAdminRideByIdResponseDto } from "@application/dto/admin/GetAdminRideByIdResponseDto";
import { GetAdminRideByIdUseCase } from "@application/use-cases/admin/GetAdminRideByIdUseCase";
import { GetAdminWalletUseCase } from "@application/use-cases/admin/GetAdminWalletUseCase";
import { GetAdminWalletDto } from "@application/dto/admin/GetAdminWalletDto";
import { GetAdminWalletResponseDto } from "@application/dto/admin/GetAdminWalletResponseDto";
import { AdminWalletController } from "@interface/controllers/admin/AdminWalletController";
import { GetAdminUserStatsUseCase } from "@application/use-cases/admin/GetAdminUserStatsUseCase";
import { AdminStatsController } from "@interface/controllers/admin/AdminStatsController";
import { GetUserStatsRequestDto } from "@application/dto/admin/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "@application/dto/admin/GetUserStatsResponseDto";
import { GetAdminRideStatsUseCase } from "@application/use-cases/admin/GetAdminRideStatsUseCase";
import { GetAdminRideStatsRequestDto } from "@application/dto/admin/GetAdminRideStatsRequestDto";
import { GetAdminRideStatsResponseDto } from "@application/dto/admin/GetAdminRideStatsResponseDto";
import { GetAdminDriverStatsUseCase } from "@application/use-cases/admin/GetAdminDriverStatsUseCase";
import { GetAdminDriverStatsRequestDto } from "@application/dto/admin/GetAdminDriverStatsRequestDto";
import { GetAdminDriverStatsResponseDto } from "@application/dto/admin/GetAdminDriverStatsResponseDto";

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
    container
      .bind<
        IUseCase<CreateCouponDto, Promise<Result<CreateCouponResponseDto>>>
      >(TYPES.CreateCouponUseCase)
      .to(CreateCouponUseCase);

    container
      .bind<
        IUseCase<EditCouponDto, Promise<Result<EditCouponResponseDto>>>
      >(TYPES.EditCouponUseCase)
      .to(EditCouponUseCase);

    container
      .bind<
        IUseCase<
          GetAdminCouponsDto,
          Promise<Result<GetAdminCouponsResponseDto>>
        >
      >(TYPES.GetAdminCouponsUseCase)
      .to(GetAdminCouponsUseCase);

    container
      .bind<
        IUseCase<
          GetAdminRatingsDto,
          Promise<Result<GetAdminRatingsResponseDto>>
        >
      >(TYPES.GetAdminRatingsUseCase)
      .to(GetAdminRatingsUseCase);

    container
      .bind<
        IUseCase<
          GetAdminTransactionsDto,
          Promise<Result<GetAdminTransactionsResponseDto>>
        >
      >(TYPES.GetAdminTransactionsUseCase)
      .to(GetAdminTransactionsUseCase);
    container
      .bind<
        IUseCase<
          GetAdminRideByIdDto,
          Promise<Result<GetAdminRideByIdResponseDto>>
        >
      >(TYPES.GetAdminRideByIdUseCase)
      .to(GetAdminRideByIdUseCase);
    container
      .bind<
        IUseCase<GetAdminWalletDto, Promise<Result<GetAdminWalletResponseDto>>>
      >(TYPES.GetAdminWalletUseCase)
      .to(GetAdminWalletUseCase);
    container
      .bind<
        IUseCase<
          GetUserStatsRequestDto,
          Promise<Result<GetUserStatsResponseDto>>
        >
      >(TYPES.GetAdminUserStatsUseCase)
      .to(GetAdminUserStatsUseCase);

    container
      .bind<
        IUseCase<
          GetAdminRideStatsRequestDto,
          Promise<Result<GetAdminRideStatsResponseDto>>
        >
      >(TYPES.GetAdminRideStatsUseCase)
      .to(GetAdminRideStatsUseCase);

    container
      .bind<
        IUseCase<
          GetAdminDriverStatsRequestDto,
          Promise<Result<GetAdminDriverStatsResponseDto>>
        >
      >(TYPES.GetAdminDriverStatsUseCase)
      .to(GetAdminDriverStatsUseCase);

    // Controller bindings
    container
      .bind<AdminUserController>(TYPES.AdminUserController)
      .to(AdminUserController);

    container
      .bind<AdminRideController>(TYPES.AdminRideController)
      .to(AdminRideController);
    container
      .bind<AdminCouponController>(TYPES.AdminCouponController)
      .to(AdminCouponController);
    container
      .bind<AdminTransactionController>(TYPES.AdminTransactionController)
      .to(AdminTransactionController);
    container
      .bind<AdminWalletController>(TYPES.AdminWalletController)
      .to(AdminWalletController);
    container.bind(TYPES.AdminStatsController).to(AdminStatsController);
  }
}
