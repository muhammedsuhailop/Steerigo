import { injectable, inject } from "inversify";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { UpdateKycStatusRequestDto } from "@application/dto/admin/UpdateKycStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DriverStatus } from "@domain/value-objects/DriverStatus";

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
      kycRequest: any;
      driverStatusUpdated: boolean;
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
        return Result.failure(new Error("KYC request not found"));
      }

      const kycRequest = kycWithDriver.kycRequest;

      if (!kycRequest.isPending() && dto.getKycStatus() !== "Under Review") {
        return Result.failure(
          new Error("Can only update pending or under review KYC requests")
        );
      }

      Logger.info("Executing UpdateKycStatusUseCase", {
        kycId: dto.getKycId(),
        newStatus: dto.getKycStatus(),
        currentStatus: kycRequest.getStatus(),
      });

      // Update KYC status based on the action
      switch (dto.getKycStatus()) {
        case "Approved":
          kycRequest.approve(dto.getReviewedBy(), dto.getComments());
          break;
        case "Rejected":
          kycRequest.reject(dto.getReviewedBy(), dto.getComments()!);
          break;
        case "Under Review":
          kycRequest.requiresReview();
          break;
        default:
          return Result.failure(new Error("Invalid KYC status"));
      }

      // Update KYC in database
      const kycUpdateSuccess = await this.kycRepository.updateKYCStatus(
        dto.getKycId(),
        dto.getKycStatus(),
        dto.getReviewedBy(),
        dto.getComments()
      );

      if (!kycUpdateSuccess) {
        return Result.failure(new Error("Failed to update KYC status"));
      }

      let driverStatusUpdated = false;

      // If KYC is approved, also update driver status to active
      if (dto.getKycStatus() === "Approved") {
        const driver = await this.adminDriverRepository.findById(
          kycWithDriver.driverInfo.driverId
        );
        if (
          driver &&
          driver.getStatus() === DriverStatus.PENDING_VERIFICATION
        ) {
          try {
            driver.approve();
            await this.adminDriverRepository.updateDriverStatus(
              driver.getId(),
              DriverStatus.ACTIVE,
              "KYC approved"
            );
            driverStatusUpdated = true;
            Logger.info("Driver status updated to active after KYC approval", {
              driverId: driver.getId(),
            });
          } catch (error) {
            Logger.warn("Failed to update driver status after KYC approval", {
              driverId: driver.getId(),
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      }

      const response = {
        message: `KYC request ${dto.getKycStatus().toLowerCase()} successfully`,
        kycRequest: {
          id: kycRequest.getId(),
          status: kycRequest.getStatus(),
          comments: kycRequest.getComments(),
          reviewedBy: kycRequest.getReviewedBy(),
          reviewedAt: kycRequest.getReviewedAt()?.toISOString() || null,
          updatedAt: kycRequest.getUpdatedAt().toISOString(),
        },
        driverStatusUpdated,
      };

      Logger.info("KYC status updated successfully", {
        kycId: dto.getKycId(),
        newStatus: dto.getKycStatus(),
        driverStatusUpdated,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating KYC status", error);
      return Result.failure(error as Error);
    }
  }
}
