import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";

export interface DriverProfileUpdateResponse {
  driver: {
    id: string;
    userId: string;
    eligibleGearTypes: string[];
    eligibleBodyTypes: string[];
    kycStatus: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
  userUpdated: boolean;
  vehiclesUpdated: boolean;
  kycStatusUpdated: boolean;
  updatedFields: string[];
}

@injectable()
export class UpdateDriverProfileUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(
    userId: string,
    dto: DriverProfileUpdateDto
  ): Promise<Result<DriverProfileUpdateResponse>> {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        Logger.warn("Profile update validation failed", {
          userId,
          errors: validationErrors,
        });
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }
      const hasUserUpdates = dto.hasUserProfileUpdates();
      const hasVehicleUpdates = dto.hasVehicleTypeUpdates();

      if (!hasUserUpdates && !hasVehicleUpdates) {
        Logger.warn("No updates provided", { userId });
        return Result.failure(
          new DomainError("At least one field must be provided for update")
        );
      }

      Logger.info("Driver profile update started", {
        userId,
        hasUserUpdates,
        hasVehicleUpdates,
      });

      const user = await this.userRepository.findById(userId);
      if (!user) {
        Logger.warn("User not found", { userId });
        return Result.failure(new DomainError("User not found"));
      }

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        Logger.warn("Driver profile not found", { userId });
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
          userId,
          updates: Object.keys(userUpdates),
        });
      }

      if (hasVehicleUpdates) {
        const gearTypes = dto.getEligibleGearTypes();
        const bodyTypes = dto.getEligibleBodyTypes();

        if (gearTypes && bodyTypes) {
          driver.updateEligibleVehicles(gearTypes as GearType[], bodyTypes as BodyType[]);
          vehiclesUpdated = true;
          updatedFields.push("eligibleVehicles");

          Logger.info("Eligible vehicles updated", {
            userId,
            gearTypes,
            bodyTypes,
          });

          driver.updateKycStatus(KYCStatus.IN_REVIEW);
          kycStatusUpdated = true;
          updatedFields.push("kycStatus");

          Logger.info("KYC status set to InReview due to vehicle type update", {
            userId,
            kycStatus: KYCStatus.IN_REVIEW,
          });
        }
      }

      if (vehiclesUpdated || kycStatusUpdated) {
        await this.driverRepository.save(driver);
        Logger.info("Driver information persisted to database", {
          userId,
          fields: updatedFields.filter(
            (f) => f === "eligibleVehicles" || f === "kycStatus"
          ),
        });
      }

      const updatedDriver = await this.driverRepository.findByUserId(userId);
      if (!updatedDriver) {
        Logger.error("Failed to retrieve updated driver", { userId });
        return Result.failure(
          new DomainError("Failed to retrieve updated driver")
        );
      }

      const response: DriverProfileUpdateResponse = {
        driver: {
          id: updatedDriver.getId(),
          userId: updatedDriver.getUserId(),
          eligibleGearTypes: updatedDriver.getEligibleGearTypes(),
          eligibleBodyTypes: updatedDriver.getEligibleBodyTypes(),
          kycStatus: updatedDriver.getKycStatus(),
          status: updatedDriver.getStatus(),
          createdAt: updatedDriver.getCreatedAt(),
          updatedAt: updatedDriver.getUpdatedAt(),
        },
        userUpdated,
        vehiclesUpdated,
        kycStatusUpdated,
        updatedFields,
      };

      Logger.info("Driver profile update successful", {
        userId,
        updatedFields,
        totalFields: updatedFields.length,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Driver profile update failed", {
        userId,
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
