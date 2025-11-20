import { injectable, inject } from "inversify";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { KYCRepository } from "@application/repositories/AdminDriverKYCRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { UpdateKycStatusRequestDto } from "@application/dto/admin/UpdateKycStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";

@injectable()
export class UpdateKycStatusUseCase {
  constructor(
    @inject(TYPES.KYCRepository)
    private kycRepository: KYCRepository,
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: AdminDriverRepository,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  async execute(dto: UpdateKycStatusRequestDto): Promise<
    Result<{
      message: string;
      kycDocument: any;
      driverKycStatusUpdated: boolean;
    }>
  > {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new Error(validationErrors.join(", ")));
      }

      const kycWithDriver = await this.kycRepository.findKYCWithDriverInfo(
        dto.getKycId()
      );
      if (!kycWithDriver) {
        return Result.failure(new Error("KYC document not found"));
      }

      const kycDocument = kycWithDriver.kycDocument;

      Logger.info("Executing UpdateKycStatusUseCase", {
        kycId: dto.getKycId(),
        newStatus: dto.getVerificationStatus(),
        currentStatus: kycDocument.getVerificationStatus(),
      });

      // Persist per-document change
      switch (dto.getVerificationStatus()) {
        case "Approved":
          kycDocument.approve(dto.getComments());
          break;
        case "Rejected":
          kycDocument.reject(dto.getComments()!);
          break;
        case "Expired":
          kycDocument.markExpired(dto.getComments());
          break;
        default:
          return Result.failure(new Error("Invalid verification status"));
      }

      const kycUpdateSuccess =
        await this.kycRepository.updateVerificationStatus(
          dto.getKycId(),
          dto.getVerificationStatus(),
          dto.getComments()
        );

      if (!kycUpdateSuccess) {
        return Result.failure(new Error("Failed to update KYC status"));
      }

      let driverKycStatusUpdated = false;

      try {
        const driver = await this.adminDriverRepository.findById(
          kycWithDriver.driverInfo.driverId
        );

        if (driver) {
          // If the current doc was set to Expired, set overall to EXPIRED
          if (dto.getVerificationStatus() === "Expired") {
            if (driver.getKycStatus() !== KYCStatus.EXPIRED) {
              driver.updateKycStatus(KYCStatus.EXPIRED);
              await this.adminDriverRepository.save(driver);
              driverKycStatusUpdated = true;
              Logger.info(
                "Driver overall KYC set to EXPIRED because updated document status is Expired",
                {
                  driverId: driver.getId(),
                  kycId: dto.getKycId(),
                }
              );
            }
          } else {
            const allDriverKycs = await this.kycRepository.findByDriverId(
              driver.getId()
            );

            const anyRejected = allDriverKycs.some((k) => k.isRejected());

            const licenseDocs = allDriverKycs.filter(
              (k) => k.getDocumentType() === DocumentType.LICENSE
            );
            const nonLicenseDocs = allDriverKycs.filter(
              (k) =>
                k.getDocumentType() === DocumentType.AADHAAR ||
                k.getDocumentType() === DocumentType.PAN ||
                k.getDocumentType() === DocumentType.PASSPORT
            );

            const latestLicense = licenseDocs.length
              ? [...licenseDocs].sort(
                  (a, b) =>
                    b.getCreatedAt().getTime() - a.getCreatedAt().getTime()
                )[0]
              : undefined;

            const licenseOk = !!latestLicense && latestLicense.isApproved();

            const nonLicenseOk = nonLicenseDocs.some((k) => k.isApproved());

            // Profile picture check
            const user = await this.userRepository.findById(driver.getUserId());
            const profilePicturePresent = !!(
              user && user.getProfilePicture()?.trim()
            );

            const approvedCondition =
              licenseOk &&
              nonLicenseOk &&
              !anyRejected &&
              profilePicturePresent;

            if (approvedCondition) {
              if (driver.getKycStatus() !== KYCStatus.APPROVED) {
                driver.updateKycStatus(KYCStatus.APPROVED);
                await this.adminDriverRepository.save(driver);
                driverKycStatusUpdated = true;
                Logger.info("Driver overall KYC set to APPROVED", {
                  driverId: driver.getId(),
                });
              }
            } else if (dto.getVerificationStatus() === "Rejected") {
              if (driver.getKycStatus() !== KYCStatus.REJECTED) {
                driver.updateKycStatus(KYCStatus.REJECTED);
                await this.adminDriverRepository.save(driver);
                driverKycStatusUpdated = true;
                Logger.info("Driver overall KYC set to REJECTED ", {
                  driverId: driver.getId(),
                });
              }
            } else {
              Logger.info(
                "Approval conditions not met and current update not Rejected; leaving overall status unchanged",
                {
                  driverId: driver.getId(),
                }
              );
            }
          }
        }
      } catch (err) {
        Logger.warn("Failed to evaluate/apply overall driver KYC status", {
          driverId: kycWithDriver.driverInfo.driverId,
          error: err instanceof Error ? err.message : String(err),
        });
      }

      const response = {
        message: `KYC document ${dto.getVerificationStatus().toLowerCase()} successfully`,
        kycDocument: {
          id: kycDocument.getId(),
          docType: kycDocument.getDocType(),
          docNumber: kycDocument.getDocNumber(),
          verificationStatus: kycDocument.getVerificationStatus(),
          comments: kycDocument.getComments(),
          docImageUrlsFront: kycDocument.getDocImageUrlsFront(),
          docImageUrlsBack: kycDocument.getDocImageUrlsBack(),
          updatedAt: kycDocument.getUpdatedAt().toISOString(),
        },
        driverKycStatusUpdated,
      };

      Logger.info("KYC status updated successfully", {
        kycId: dto.getKycId(),
        newStatus: dto.getVerificationStatus(),
        driverKycStatusUpdated,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating KYC status", error);
      return Result.failure(error as Error);
    }
  }
}
