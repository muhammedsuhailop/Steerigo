import { injectable, inject } from "inversify";
import { IAdminUserRepository } from "@domain/repositories/admin/IAdminUserRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UpdateUserStatusDto } from "../../dto/admin/UpdateUserStatusDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { DomainError } from "@domain/errors/DomainError";

@injectable()
export class UpdateUserStatusUseCase {
  constructor(
    @inject("IAdminUserRepository")
    private adminUserRepository: IAdminUserRepository,
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(dto: UpdateUserStatusDto): Promise<Result<void>> {
    try {
      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new DomainError("User not found"));
      }

      const newStatus = dto.getStatusFromAction();

      if (dto.action === "suspend" && user.getRole() === "Admin") {
        return Result.failure(new DomainError("Cannot suspend admin users"));
      }

      await this.adminUserRepository.updateUserStatus(dto.userId, newStatus);

      Logger.info("User status updated", {
        userId: dto.userId,
        action: dto.action,
        newStatus,
      });

      return Result.success();
    } catch (error) {
      Logger.error("Error updating user status", error);
      return Result.failure(error as Error);
    }
  }
}
