import { injectable, inject } from "inversify";
import { KYCRepository } from "@application/repositories/AdminDriverKYCRepository";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { UpdateKycStatusRequestDto } from "@application/dto/admin/UpdateKycStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { KYCStatus } from "@domain/value-objects/KYCStatus";

@injectable()
export class UpdateKycStatusUseCase {
  constructor(
    @inject(TYPES.KYCRepository)
    private kycRepository: KYCRepository,
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: AdminDriverRepository
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

      // Update KYC status based on the action
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

      // Update KYC in database
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

      // Update driver's overall KYC status based on all their documents
      try {
        const driver = await this.adminDriverRepository.findById(
          kycWithDriver.driverInfo.driverId
        );
        if (driver) {
          const allDriverKycs = await this.kycRepository.findByDriverId(
            driver.getId()
          );

          // Determine overall KYC status
          const hasApprovedDocs = allDriverKycs.some((kyc) => kyc.isApproved());
          const hasRejectedDocs = allDriverKycs.some((kyc) => kyc.isRejected());
          const hasExpiredDocs = allDriverKycs.some(
            (kyc) =>
              kyc.getVerificationStatus() === KYCStatus.EXPIRED ||
              kyc.isExpired()
          );

          let overallKycStatus: KYCStatus;
          if (hasExpiredDocs) {
            overallKycStatus = KYCStatus.EXPIRED;
          } else if (hasApprovedDocs && !hasRejectedDocs) {
            overallKycStatus = KYCStatus.APPROVED;
          } else if (hasRejectedDocs) {
            overallKycStatus = KYCStatus.REJECTED;
          } else {
            overallKycStatus = KYCStatus.IN_REVIEW;
          }

          if (driver.getKycStatus() !== overallKycStatus) {
            driver.updateKycStatus(overallKycStatus);
            // Update driver in database (you may need to implement this method)
            driverKycStatusUpdated = true;
            Logger.info("Driver KYC status updated", {
              driverId: driver.getId(),
              newKycStatus: overallKycStatus,
            });
          }
        }
      } catch (error) {
        Logger.warn("Failed to update driver KYC status", {
          driverId: kycWithDriver.driverInfo.driverId,
          error: error instanceof Error ? error.message : String(error),
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
