import { injectable, inject } from "inversify";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { KYCRepository } from "@application/repositories/AdminDriverKYCRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { UpdateDriverKycStatusRequestDto } from "@application/dto/admin/UpdateDriverKycStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
import {
  KYCNotFoundError,
  ProfilePictureNotUploadedError,
  LicenseNotApprovedError,
  NonLicenseKYCNotApprovedError,
  InvalidKYCStatusTransitionError,
} from "@domain/errors/KYCValidationErrors";
import { DomainError } from "@domain/errors/DomainError";
import { KYC } from "@domain/entities/KYC";

interface UpdateDriverKycStatusResponse {
  message: string;
  driverId: string;
  previousKycStatus: string;
  newKycStatus: string;
}

@injectable()
export class UpdateDriverKycStatusUseCase {
  constructor(
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: AdminDriverRepository,
    @inject(TYPES.KYCRepository)
    private kycRepository: KYCRepository,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  async execute(
    dto: UpdateDriverKycStatusRequestDto
  ): Promise<Result<UpdateDriverKycStatusResponse>> {
    try {
      Logger.info("Executing UpdateDriverKycStatusUseCase", {
        driverId: dto.getDriverId(),
        newKycStatus: dto.getKycStatus(),
      });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      const driver = await this.adminDriverRepository.findById(
        dto.getDriverId()
      );
      if (!driver) {
        Logger.warn("Driver not found", { driverId: dto.getDriverId() });
        return Result.failure(new DomainError("Driver not found"));
      }

      const previousKycStatus = driver.getKycStatus();

      const newKycStatus = dto.getKycStatus() as KYCStatus;

      const kycDocuments = await this.kycRepository.findByDriverId(
        dto.getDriverId()
      );

      if (!kycDocuments || kycDocuments.length === 0) {
        Logger.warn("No KYC documents found for driver", {
          driverId: dto.getDriverId(),
        });
        return Result.failure(
          new KYCNotFoundError("No KYC documents found for this driver")
        );
      }

      const user = await this.userRepository.findById(driver.getUserId());
      if (!user) {
        Logger.warn("User not found for driver", {
          driverId: dto.getDriverId(),
          userId: driver.getUserId(),
        });
        return Result.failure(new DomainError("User not found"));
      }

      if (newKycStatus === KYCStatus.APPROVED) {
        const profilePicture = user.getProfilePicture();
        if (!profilePicture || profilePicture.trim() === "") {
          Logger.warn("Profile picture not uploaded", {
            driverId: dto.getDriverId(),
            userId: user.getId(),
          });
          return Result.failure(
            new ProfilePictureNotUploadedError(
              "Driver must upload a profile picture before KYC approval"
            )
          );
        }
      }

      const licenseDocuments = kycDocuments.filter(
        (kyc) => kyc.getDocumentType() === DocumentType.LICENSE
      );

      const nonLicenseDocuments = kycDocuments.filter(
        (kyc) =>
          kyc.getDocumentType() === DocumentType.AADHAAR ||
          kyc.getDocumentType() === DocumentType.PAN ||
          kyc.getDocumentType() === DocumentType.PASSPORT
      );

      const hasApprovedNonLicenseKyc = nonLicenseDocuments.some(
        (kyc) => kyc.getVerificationStatus() === KYCStatus.APPROVED
      );

      if (!hasApprovedNonLicenseKyc) {
        Logger.warn("No approved non-license KYC documents", {
          driverId: dto.getDriverId(),
          nonLicenseDocsCount: nonLicenseDocuments.length,
        });
        return Result.failure(
          new NonLicenseKYCNotApprovedError(
            "At least one non-license KYC document (Aadhaar, PAN, or Passport) must be approved"
          )
        );
      }

      if (licenseDocuments.length === 0) {
        Logger.warn("No license documents found", {
          driverId: dto.getDriverId(),
        });
        return Result.failure(
          new LicenseNotApprovedError("No license document found for driver")
        );
      }

      const latestLicense = [...licenseDocuments].sort(
        (a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime()
      )[0];

      if (!latestLicense) {
        Logger.warn("Unable to determine latest license", {
          driverId: dto.getDriverId(),
        });
        return Result.failure(
          new LicenseNotApprovedError("No license document found for driver")
        );
      }

      if (latestLicense.getVerificationStatus() !== KYCStatus.APPROVED) {
        Logger.warn("Latest license is not approved", {
          driverId: dto.getDriverId(),
          licenseId: latestLicense.getId(),
          licenseStatus: latestLicense.getVerificationStatus(),
        });
        return Result.failure(
          new LicenseNotApprovedError(
            `Latest license must be approved. Current status: ${latestLicense.getVerificationStatus()}`
          )
        );
      }

      driver.updateKycStatus(newKycStatus);

      await this.adminDriverRepository.save(driver);

      Logger.info("Driver KYC status updated successfully", {
        driverId: dto.getDriverId(),
        previousKycStatus,
        newKycStatus,
      });

      return Result.success({
        message: `Driver KYC status updated to ${newKycStatus} successfully`,
        driverId: dto.getDriverId(),
        previousKycStatus,
        newKycStatus,
      });
    } catch (error) {
      Logger.error("Error updating driver KYC status", {
        driverId: dto.getDriverId(),
        error,
      });
      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError("Failed to update driver KYC status")
      );
    }
  }
}
