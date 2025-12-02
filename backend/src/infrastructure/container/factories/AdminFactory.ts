import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// Admin Repositories
import { AdminUserRepository } from "@application/repositories/AdminUserRepository";
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

export class AdminFactory {
  static register(container: Container): void {
    // Repository bindings
    container
      .bind<AdminUserRepository>(TYPES.AdminUserRepository)
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

    // Controller bindings
    container
      .bind<AdminUserController>(TYPES.AdminUserController)
      .to(AdminUserController);
  }
}
