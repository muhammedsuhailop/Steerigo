import { injectable, inject } from "inversify";
import { IAdminDriverRepository } from "@application/repositories/IAdminDriverRepository";
import { DriverActionRequestDto } from "@application/dto/admin/DriverActionRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class DriverActionUseCase
  implements
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
{
  constructor(
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: IAdminDriverRepository
  ) {}

  async execute(dto: DriverActionRequestDto): Promise<
    Result<{
      message: string;
      driverId: string;
      newStatus: string;
    }>
  > {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new Error(validationErrors.join(", ")));
      }

      const driver = await this.adminDriverRepository.findById(
        dto.getDriverId()
      );
      if (!driver) {
        return Result.failure(new Error("Driver not found"));
      }

      if (!driver.canBeActioned()) {
        return Result.failure(
          new Error("Driver cannot be actioned in current status")
        );
      }

      Logger.info("Executing driver action", {
        driverId: dto.getDriverId(),
        action: dto.getAction(),
        currentStatus: driver.getStatus(),
      });

      let newStatus: DriverStatus;
      let message: string;

      switch (dto.getAction()) {
        case "block":
          driver.block(dto.getReason());
          newStatus = DriverStatus.BLOCKED;
          message = "Driver blocked successfully";
          break;
        case "suspend":
          driver.suspend(dto.getReason());
          newStatus = DriverStatus.SUSPENDED;
          message = "Driver suspended successfully";
          break;
        case "activate":
          driver.activate();
          newStatus = DriverStatus.ACTIVE;
          message = "Driver activated successfully";
          break;
        default:
          return Result.failure(new Error("Invalid action"));
      }

      const success = await this.adminDriverRepository.updateDriverStatus(
        dto.getDriverId(),
        newStatus,
        dto.getReason()
      );

      if (!success) {
        return Result.failure(new Error("Failed to update driver status"));
      }

      Logger.info("Driver action completed successfully", {
        driverId: dto.getDriverId(),
        action: dto.getAction(),
        newStatus,
      });

      return Result.success({
        message,
        driverId: dto.getDriverId(),
        newStatus,
      });
    } catch (error) {
      Logger.error("Error executing driver action", error);
      return Result.failure(error as Error);
    }
  }
}
