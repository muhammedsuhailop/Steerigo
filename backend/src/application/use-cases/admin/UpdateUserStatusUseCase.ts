import { injectable, inject } from "inversify";
import { AdminUserRepository } from "@application/repositories/AdminUserRepository";
import { UpdateUserStatusRequestDto } from "@application/dto/admin/UpdateUserStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  AdminUserNotFoundError,
  AdminUnauthorizedActionError,
} from "@domain/errors/AdminErrors";
import { AdminUserAction } from "@domain/value-objects/AdminAction";

@injectable()
export class UpdateUserStatusUseCase {
  constructor(
    @inject(TYPES.AdminUserRepository)
    private adminUserRepository: AdminUserRepository
  ) {}

  async execute(dto: UpdateUserStatusRequestDto): Promise<Result<any>> {
    try {
      Logger.info("Executing UpdateUserStatusUseCase", {
        userId: dto.getUserId(),
        action: dto.getAction(),
      });

      // Check if user exists
      const user = await this.adminUserRepository.findById(dto.getUserId());
      if (!user) {
        return Result.failure(new AdminUserNotFoundError(dto.getUserId()));
      }

      // Validate action based on current user state
      const validationResult = this.validateAction(user, dto.getAction());
      if (validationResult.isFailure()) {
        return validationResult;
      }

      // Determine new status based on action
      const newStatus = this.mapActionToStatus(dto.getAction());

      // Update user status
      const updated = await this.adminUserRepository.updateUserStatus(
        dto.getUserId(),
        newStatus,
        dto.getReason()
      );

      if (!updated) {
        return Result.failure(new Error("Failed to update user status"));
      }

      Logger.info("User status updated successfully", {
        userId: dto.getUserId(),
        oldStatus: user.getStatus(),
        newStatus,
        action: dto.getAction(),
      });

      return Result.success({
        message: `User ${dto.getAction()}d successfully`,
        userId: dto.getUserId(),
        newStatus,
      });
    } catch (error) {
      Logger.error("Error updating user status", error);
      return Result.failure(error as Error);
    }
  }

  private validateAction(user: any, action: AdminUserAction): Result<void> {
    const currentStatus = user.getStatus();

    switch (action) {
      case AdminUserAction.ACTIVATE:
        if (currentStatus === "Active") {
          return Result.failure(
            new AdminUnauthorizedActionError(action, "User is already active")
          );
        }
        break;
      case AdminUserAction.DEACTIVATE:
        if (currentStatus === "Inactive") {
          return Result.failure(
            new AdminUnauthorizedActionError(action, "User is already inactive")
          );
        }
        break;
      case AdminUserAction.SUSPEND:
        if (currentStatus === "Suspended") {
          return Result.failure(
            new AdminUnauthorizedActionError(
              action,
              "User is already suspended"
            )
          );
        }
        break;
      case AdminUserAction.DELETE:
        if (currentStatus === "Deleted") {
          return Result.failure(
            new AdminUnauthorizedActionError(action, "User is already deleted")
          );
        }
        break;
    }

    return Result.success(undefined);
  }

  private mapActionToStatus(action: AdminUserAction): string {
    switch (action) {
      case AdminUserAction.ACTIVATE:
        return "Active";
      case AdminUserAction.DEACTIVATE:
        return "Inactive";
      case AdminUserAction.SUSPEND:
        return "Suspended";
      case AdminUserAction.DELETE:
        return "Deleted";
      default:
        throw new Error(`Unmapped action: ${action}`);
    }
  }
}
