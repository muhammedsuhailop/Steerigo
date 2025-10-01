import { injectable, inject } from "inversify";
import { IAdminDriverRepository } from "@domain/repositories/admin/IAdminDriverRepository";
import { DriverActionDto } from "../../dto/admin/DriverActionDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class DriverActionUseCase {
  constructor(
    @inject("IAdminDriverRepository")
    private adminDriverRepository: IAdminDriverRepository
  ) {}

  async execute(dto: DriverActionDto): Promise<Result<void>> {
    try {
      const driverWithUser =
        await this.adminDriverRepository.findDriverWithUser(dto.driverId);

      if (!driverWithUser) {
        return Result.failure(new Error("Driver not found"));
      }

      const newStatus = dto.getStatusFromAction();

      if (driverWithUser.driver.getStatus() === newStatus) {
        return Result.failure(
          new Error(`Driver is already ${newStatus.toLowerCase()}`)
        );
      }

      await this.adminDriverRepository.updateDriverStatus(
        dto.driverId,
        newStatus
      );

      Logger.info(`Driver status updated successfully`, {
        driverId: dto.driverId,
        action: dto.action,
        newStatus,
      });

      return Result.success(undefined);
    } catch (error) {
      Logger.error("Error updating driver status", error);
      return Result.failure(error as Error);
    }
  }
}
