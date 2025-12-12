import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IKYCRepository } from "@domain/repositories/IKYCRepository";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { Result } from "@shared/utils/Result";
import { KYC } from "@domain/entities/KYC";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { Types } from "mongoose";
import { SubmitKYCResponseDto } from "@application/dto/driver/SubmitKYCResponseDto";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class SubmitKYCUseCase
  implements
    IUseCase<KYCSubmissionRequestDto, Promise<Result<SubmitKYCResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: IDriverRepository,
    @inject(TYPES.KYCRepository) private kycRepository: IKYCRepository
  ) {}

  async execute(
    dto: KYCSubmissionRequestDto
  ): Promise<Result<SubmitKYCResponseDto>> {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        Logger.warn("KYC submission validation failed", {
          userId: dto.getUserId(),
          errors: validationErrors,
        });
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        Logger.warn("Driver profile not found for KYC update", dto.getUserId());
        return Result.failure(new DomainError("Driver profile not found"));
      }

      Logger.info("KYC submission started", {
        userId: dto.getUserId(),
        driverId: driver.getId(),
        hasLicense: dto.hasLicenseUpdate(),
        hasId: dto.hasIdUpdate(),
      });

      const now = new Date();

      if (dto.getLicenseExpiryDate()) {
        if (dto.getLicenseExpiryDate()! <= now) {
          Logger.warn("License expiry date in past", dto.getUserId());
          return Result.failure(
            new DomainError("License expiry date must be in the future")
          );
        }
      }

      if (dto.getLicenseIssueDate()) {
        if (dto.getLicenseIssueDate()! > now) {
          Logger.warn("License issue date in future", dto.getUserId());
          return Result.failure(
            new DomainError("License issue date cannot be in the future")
          );
        }
      }

      if (
        dto.getIdExpiryDate() !== undefined &&
        dto.getIdExpiryDate() !== null
      ) {
        if (dto.getIdExpiryDate()! <= now) {
          Logger.warn("ID expiry date in past", dto.getUserId());
          return Result.failure(
            new DomainError("ID expiry date must be in the future")
          );
        }
      }

      if (dto.getIdIssueDate()) {
        if (dto.getIdIssueDate()! > now) {
          Logger.warn("ID issue date in future", dto.getUserId());
          return Result.failure(
            new DomainError("ID issue date cannot be in the future")
          );
        }
      }

      const kycDocuments: { [key: string]: string } = {};
      let licenseUpdated = false;
      let idUpdated = false;
      let driverUpdated = false;

      if (dto.hasLicenseUpdate()) {
        const licenseKyc = await this.createNewLicenseKyc(driver.getId(), dto);

        if (licenseKyc) {
          kycDocuments.license = licenseKyc.getId();
          licenseUpdated = true;

          Logger.info("New license KYC created", {
            userId: dto.getUserId(),
            driverId: driver.getId(),
            kycId: licenseKyc.getId(),
            licenseNumber: dto.getLicenseNumber(),
          });

          driver.updateLicenseInfo(
            dto.getLicenseCategory()!,
            dto.getLicenseIssueDate()!,
            dto.getLicenseExpiryDate()!
          );

          const gearTypes = dto.getEligibleGearTypes();
          const bodyTypes = dto.getEligibleBodyTypes();

          if (gearTypes && bodyTypes) {
            driver.updateEligibleVehicles(gearTypes, bodyTypes);
            Logger.info("Driver eligible vehicles updated", {
              userId: dto.getUserId(),
              gearTypes,
              bodyTypes,
            });
          }

          driver.updateKycStatus(KYCStatus.IN_REVIEW);

          await this.driverRepository.save(driver);
          driverUpdated = true;

          Logger.info("Driver license information updated", {
            userId: dto.getUserId(),
            driverId: driver.getId(),
            kycStatusSet: KYCStatus.IN_REVIEW,
          });
        }
      }

      if (dto.hasIdUpdate()) {
        const idKyc = await this.createNewIdKyc(driver.getId(), dto);

        if (idKyc) {
          kycDocuments.id = idKyc.getId();
          idUpdated = true;

          Logger.info("New ID KYC created", {
            userId: driver.getUserId(),
            driverId: driver.getId(),
            kycId: idKyc.getId(),
            idType: dto.getIdType(),
          });
        }
      }

      const response = new SubmitKYCResponseDto(
        "KYC documents submitted successfully",
        kycDocuments,
        licenseUpdated,
        idUpdated,
        driverUpdated
      );

      Logger.info("KYC submission completed successfully", {
        userId: driver.getUserId(),
        driverId: driver.getId(),
        kycDocuments,
        driverUpdated,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("KYC submission failed", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private async createNewLicenseKyc(
    driverId: string,
    dto: KYCSubmissionRequestDto
  ): Promise<KYC | null> {
    try {
      const licenseId = new Types.ObjectId().toString();

      const licenseImages = dto.getLicenseImageUrls() || {
        front: [],
        back: [],
      };

      const licenseKyc = KYC.create(
        licenseId,
        driverId,
        DocumentType.LICENSE,
        dto.getLicenseNumber()!,
        dto.getLicenseIssueDate(),
        dto.getLicenseExpiryDate(),
        licenseImages.front,
        licenseImages.back
      );

      const savedKyc = await this.kycRepository.save(licenseKyc);

      Logger.info("New license KYC saved to DB", {
        driverId,
        kycId: savedKyc.getId(),
      });

      return savedKyc;
    } catch (error) {
      Logger.error("Failed to create new license KYC", {
        driverId,
        error,
      });
      throw error;
    }
  }

  private async createNewIdKyc(
    driverId: string,
    dto: KYCSubmissionRequestDto
  ): Promise<KYC | null> {
    try {
      const idId = new Types.ObjectId().toString();

      const idImages = dto.getIdImageUrls() || {
        front: [],
        back: [],
      };

      const idKyc = KYC.create(
        idId,
        driverId,
        dto.getIdType()!,
        dto.getIdNumber()!,
        dto.getIdIssueDate(),
        dto.getIdExpiryDate() ?? undefined,
        idImages.front,
        idImages.back
      );

      const savedKyc = await this.kycRepository.save(idKyc);

      Logger.info("New ID KYC saved to DB", {
        driverId,
        kycId: savedKyc.getId(),
        idType: dto.getIdType(),
      });

      return savedKyc;
    } catch (error) {
      Logger.error("Failed to create new ID KYC", {
        driverId,
        error,
      });
      throw error;
    }
  }
}
