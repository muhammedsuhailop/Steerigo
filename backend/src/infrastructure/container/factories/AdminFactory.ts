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

export class AdminFactory {
  static register(container: Container): void {
    // Repository bindings
    container
      .bind<AdminUserRepository>(TYPES.AdminUserRepository)
      .to(AdminUserRepositoryImpl);

    // Use case bindings
    container.bind<GetUsersUseCase>(TYPES.GetUsersUseCase).to(GetUsersUseCase);
    container
      .bind<UpdateUserStatusUseCase>(TYPES.UpdateUserStatusUseCase)
      .to(UpdateUserStatusUseCase);

    // Controller bindings
    container
      .bind<AdminUserController>(TYPES.AdminUserController)
      .to(AdminUserController);
  }
}
