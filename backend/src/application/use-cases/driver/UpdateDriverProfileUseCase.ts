import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { DriverResponseDto } from "@application/dto/driver/DriverResponseDto";
import { Result } from "@shared/utils/Result";
import { KYC } from "@domain/entities/KYC";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { Types } from "mongoose";

export interface DriverProfileUpdateResponse {
  driver: DriverResponseDto;
  userUpdated: boolean;
  licenseKycUpdated: boolean;
  idKycUpdated: boolean;
  updatedFields: string[];
}

@injectable()
export class UpdateDriverProfileUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.KYCRepository) private kycRepository: KYCRepository
  ) {}

  async execute(
    userId: string,
    dto: DriverProfileUpdateDto
  ): Promise<Result<DriverProfileUpdateResponse>> {
    try {
      Logger.info("Driver profile update started", { userId });

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
      let licenseKycUpdated = false;
      let idKycUpdated = false;

      if (dto.hasUserProfileUpdates()) {
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

      let driverChanged = false;

      if (dto.hasDriverLicenseUpdates()) {
        // Update eligible vehicles
        if (dto.getEligibleGearTypes() && dto.getEligibleBodyTypes()) {
          driver.updateEligibleVehicles(
            dto.getEligibleGearTypes()!,
            dto.getEligibleBodyTypes()!
          );
          updatedFields.push("eligibleVehicles");
          driverChanged = true;
          Logger.info("Eligible vehicles updated", {
            userId,
            gearTypes: dto.getEligibleGearTypes(),
            bodyTypes: dto.getEligibleBodyTypes(),
          });
        }

        // Update license info
        if (
          dto.getLicenceCategory() &&
          dto.getLicenseIssueDate() &&
          dto.getLicenseExpiryDate()
        ) {
          const now = new Date();

          if (dto.getLicenseExpiryDate()! <= now) {
            Logger.warn("License expiry date in past", {
              userId,
              expiryDate: dto.getLicenseExpiryDate(),
            });
            return Result.failure(
              new DomainError("License expiry date must be in the future")
            );
          }

          if (dto.getLicenseIssueDate()! > now) {
            Logger.warn("License issue date in future", {
              userId,
              issueDate: dto.getLicenseIssueDate(),
            });
            return Result.failure(
              new DomainError("License issue date cannot be in the future")
            );
          }

          driver.updateLicenseInfo(
            dto.getLicenceCategory()!,
            dto.getLicenseIssueDate()!,
            dto.getLicenseExpiryDate()!
          );
          updatedFields.push("licenseInfo");
          driverChanged = true;
          Logger.info("License information updated", {
            userId,
            licenceCategory: dto.getLicenceCategory(),
          });
        }

        if (driverChanged) {
          await this.driverRepository.save(driver);
          Logger.info("Driver information persisted to database", {
            userId,
            fields: updatedFields.filter(
              (f) => f === "eligibleVehicles" || f === "licenseInfo"
            ),
          });
        }
      }

      if (
        dto.getLicenseNumber() ||
        dto.getLicenseFrontImage() ||
        dto.getLicenseBackImage()
      ) {
        const existingLicenseKyc =
          await this.kycRepository.findByDriverAndDocType(
            driver.getId(),
            DocumentType.LICENSE
          );

        if (existingLicenseKyc) {
          if (dto.getLicenseNumber()) {
            existingLicenseKyc.updateDocument(
              DocumentType.LICENSE,
              dto.getLicenseNumber()!,
              dto.getLicenseIssueDate(),
              dto.getLicenseExpiryDate()
            );
            Logger.info("License KYC document updated", { userId });
          }

          if (dto.getLicenseFrontImage() || dto.getLicenseBackImage()) {
            const frontUrls = dto.getLicenseFrontImage()
              ? [dto.getLicenseFrontImage()!]
              : existingLicenseKyc.getDocImageUrlsFront();
            const backUrls = dto.getLicenseBackImage()
              ? [dto.getLicenseBackImage()!]
              : existingLicenseKyc.getDocImageUrlsBack();
            existingLicenseKyc.updateDocumentImages(frontUrls, backUrls);
            Logger.info("License KYC images updated", { userId });
          }

          await this.kycRepository.save(existingLicenseKyc);
          licenseKycUpdated = true;
          updatedFields.push("licenseKyc");
        } else if (dto.getLicenseNumber()) {
          // Create new license KYC
          const licenseKycId = new Types.ObjectId().toString();
          const licenseKyc = KYC.create(
            licenseKycId,
            driver.getId(),
            DocumentType.LICENSE,
            dto.getLicenseNumber()!,
            dto.getLicenseIssueDate(),
            dto.getLicenseExpiryDate(),
            dto.getLicenseFrontImage() ? [dto.getLicenseFrontImage()!] : [],
            dto.getLicenseBackImage() ? [dto.getLicenseBackImage()!] : []
          );
          await this.kycRepository.save(licenseKyc);
          licenseKycUpdated = true;
          updatedFields.push("newLicenseKyc");
          Logger.info("New license KYC created", { userId });
        }
      }

      if (
        dto.getIdNumber() ||
        dto.getIdFrontImage() ||
        dto.getIdBackImage() ||
        dto.getIdType()
      ) {
        const existingIdKycs = await this.kycRepository.findByDriverId(
          driver.getId()
        );

        const existingIdKyc = existingIdKycs.find(
          (kyc) => kyc.getDocType() !== DocumentType.LICENSE
        );

        if (existingIdKyc && dto.getIdNumber() && dto.getIdType()) {
          // Update existing ID KYC
          existingIdKyc.updateDocument(
            dto.getIdType()!,
            dto.getIdNumber()!,
            dto.getIdIssueDate(),
            dto.getIdExpiryDate()
          );
          Logger.info("ID KYC document updated", { userId });

          if (dto.getIdFrontImage() || dto.getIdBackImage()) {
            const frontUrls = dto.getIdFrontImage()
              ? [dto.getIdFrontImage()!]
              : existingIdKyc.getDocImageUrlsFront();
            const backUrls = dto.getIdBackImage()
              ? [dto.getIdBackImage()!]
              : existingIdKyc.getDocImageUrlsBack();
            existingIdKyc.updateDocumentImages(frontUrls, backUrls);
            Logger.info("ID KYC images updated", { userId });
          }

          await this.kycRepository.save(existingIdKyc);
          idKycUpdated = true;
          updatedFields.push("idKyc");
        } else if (dto.getIdNumber() && dto.getIdType()) {
          // Create new ID KYC
          const idKycId = new Types.ObjectId().toString();
          const idKyc = KYC.create(
            idKycId,
            driver.getId(),
            dto.getIdType()!,
            dto.getIdNumber()!,
            dto.getIdIssueDate(),
            dto.getIdExpiryDate(),
            dto.getIdFrontImage() ? [dto.getIdFrontImage()!] : [],
            dto.getIdBackImage() ? [dto.getIdBackImage()!] : []
          );
          await this.kycRepository.save(idKyc);
          idKycUpdated = true;
          updatedFields.push("newIdKyc");
          Logger.info("New ID KYC created", { userId });
        }
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
          licenceCategory: updatedDriver.getLicenceCategory(),
          licenseIssueDate: updatedDriver.getLicenseIssueDate(),
          licenseExpiryDate: updatedDriver.getLicenseExpiryDate(),
          kycStatus: updatedDriver.getKycStatus(),
          status: updatedDriver.getStatus(),
          createdAt: updatedDriver.getCreatedAt(),
          updatedAt: updatedDriver.getUpdatedAt(),
        },
        userUpdated,
        licenseKycUpdated,
        idKycUpdated,
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
