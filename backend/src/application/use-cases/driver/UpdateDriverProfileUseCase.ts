import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";
import { IUseCase } from "../interfaces/IUseCase";
import {
  DriverProfileDto,
  UpdateDriverProfileResponseDto,
} from "@application/dto/driver/UpdateDriverProfileResponseDto";

@injectable()
export class UpdateDriverProfileUseCase
  implements
    IUseCase<
      DriverProfileUpdateDto,
      Promise<Result<UpdateDriverProfileResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(
    dto: DriverProfileUpdateDto
  ): Promise<Result<UpdateDriverProfileResponseDto>> {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        Logger.warn("Profile update validation failed", {
          userId: dto.getUserId(),
          errors: validationErrors,
        });
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      const hasUserUpdates = dto.hasUserProfileUpdates();
      const hasVehicleUpdates = dto.hasVehicleTypeUpdates();

      if (!hasUserUpdates && !hasVehicleUpdates) {
        Logger.warn("No updates provided", dto.getUserId());
        return Result.failure(
          new DomainError("At least one field must be provided for update")
        );
      }

      Logger.info("Driver profile update started", {
        userId: dto.getUserId(),
        hasUserUpdates,
        hasVehicleUpdates,
      });

      const user = await this.userRepository.findById(dto.getUserId());
      if (!user) {
        Logger.warn("User not found", dto.getUserId());
        return Result.failure(new DomainError("User not found"));
      }

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        Logger.warn("Driver profile not found", dto.getUserId());
        return Result.failure(new DomainError("Driver profile not found"));
      }

      const updatedFields: string[] = [];
      let userUpdated = false;
      let vehiclesUpdated = false;
      let kycStatusUpdated = false;

      if (hasUserUpdates) {
        const userUpdates = dto.getUserProfileUpdates();
        user.updateProfile(userUpdates);
        await this.userRepository.save(user);
        userUpdated = true;
        updatedFields.push("userProfile");

        Logger.info("User profile updated", {
          userId: dto.getUserId(),
          updates: Object.keys(userUpdates),
        });
      }

      if (hasVehicleUpdates) {
        const gearTypes = dto.getEligibleGearTypes();
        const bodyTypes = dto.getEligibleBodyTypes();

        if (gearTypes && bodyTypes) {
          driver.updateEligibleVehicles(
            gearTypes as GearType[],
            bodyTypes as BodyType[]
          );
          vehiclesUpdated = true;
          updatedFields.push("eligibleVehicles");

          Logger.info("Eligible vehicles updated", {
            userId: dto.getUserId(),
            gearTypes,
            bodyTypes,
          });

          driver.updateKycStatus(KYCStatus.IN_REVIEW);
          kycStatusUpdated = true;
          updatedFields.push("kycStatus");

          Logger.info("KYC status set to InReview due to vehicle type update", {
            userId: dto.getUserId(),
            kycStatus: KYCStatus.IN_REVIEW,
          });
        }
      }

      if (vehiclesUpdated || kycStatusUpdated) {
        await this.driverRepository.save(driver);
        Logger.info("Driver information persisted to database", {
          userId: dto.getUserId(),
          fields: updatedFields.filter(
            (f) => f === "eligibleVehicles" || f === "kycStatus"
          ),
        });
      }

      const updatedDriver = await this.driverRepository.findByUserId(
        dto.getUserId()
      );
      if (!updatedDriver) {
        Logger.error("Failed to retrieve updated driver", dto.getUserId());
        return Result.failure(
          new DomainError("Failed to retrieve updated driver")
        );
      }

      const driverProfileDto = new DriverProfileDto(
        updatedDriver.getId(),
        updatedDriver.getUserId(),
        updatedDriver.getEligibleGearTypes(),
        updatedDriver.getEligibleBodyTypes(),
        updatedDriver.getKycStatus(),
        updatedDriver.getStatus(),
        updatedDriver.getCreatedAt(),
        updatedDriver.getUpdatedAt()
      );

      const response = new UpdateDriverProfileResponseDto(
        driverProfileDto,
        userUpdated,
        vehiclesUpdated,
        kycStatusUpdated,
        updatedFields
      );

      Logger.info("Driver profile update successful", {
        userId: dto.getUserId(),
        updatedFields,
        totalFields: updatedFields.length,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Driver profile update failed", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError(
              "Failed to update driver profile. Please try again later"
            )
      );
    }
  }
}
