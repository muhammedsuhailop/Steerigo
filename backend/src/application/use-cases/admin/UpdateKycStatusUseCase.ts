import { injectable, inject } from "inversify";
import { IAdminKycRepository } from "@domain/repositories/admin/IAdminKycRepository";
import { IAdminDriverRepository } from "@domain/repositories/admin/IAdminDriverRepository";
import { UpdateKycStatusDto } from "../../dto/admin/UpdateKycStatusDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class UpdateKycStatusUseCase {
  constructor(
    @inject("IAdminKycRepository")
    private adminKycRepository: IAdminKycRepository,
    @inject("IAdminDriverRepository")
    private adminDriverRepository: IAdminDriverRepository
  ) {}

  async execute(dto: UpdateKycStatusDto): Promise<Result<any>> {
    try {
      Logger.info("UpdateKycStatusUseCase started", {
        kycId: dto.kycId,
        kycStatus: dto.kycStatus,
        comments: dto.comments ? "provided" : "none",
      });

      const kycRequest = await this.adminKycRepository.findKycRequestById(
        dto.kycId
      );

      if (!kycRequest) {
        return Result.failure(new Error("KYC request not found"));
      }

      const isVerified = dto.kycStatus === "approved";
      await this.adminKycRepository.updateKycStatus(
        dto.kycId,
        isVerified,
        dto.comments
      );

      Logger.info("KYC status updated successfully", {
        kycId: dto.kycId,
        kycStatus: dto.kycStatus,
        isVerified,
      });

      let driverStatusUpdated = false;
      if (isVerified) {
        const allKycRequests =
          await this.adminKycRepository.findKycRequestsByDriverId(
            kycRequest.driverId,
            { page: 1, pageSize: 50 }
          );

        const allRequiredKycsApproved = this.checkAllRequiredKycsApproved(
          allKycRequests.data
        );

        if (allRequiredKycsApproved) {
          const driverWithUser =
            await this.adminDriverRepository.findDriverWithUser(
              kycRequest.driverId
            );

          if (driverWithUser && driverWithUser.driver.status !== "Active") {
            await this.adminDriverRepository.updateDriverStatus(
              kycRequest.driverId,
              "Active",
              "All required KYC documents approved"
            );

            driverStatusUpdated = true;

            Logger.info("Driver automatically activated", {
              driverId: kycRequest.driverId,
              previousStatus: driverWithUser.driver.status,
              newStatus: "Active",
              reason: "All required KYC documents approved",
            });
          }
        }
      }

      const response = {
        kycRequest: {
          id: dto.kycId,
          status: dto.kycStatus,
          isVerified,
          comments: dto.comments,
          updatedAt: new Date(),
        },
        driverStatusUpdated,
        message: driverStatusUpdated
          ? `KYC ${dto.kycStatus} successfully and driver status updated to Active`
          : `KYC status updated to ${dto.kycStatus} successfully`,
      };

      Logger.info("UpdateKycStatusUseCase completed", {
        kycId: dto.kycId,
        driverStatusUpdated,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error in UpdateKycStatusUseCase", error);
      return Result.failure(error as Error);
    }
  }

  private checkAllRequiredKycsApproved(kycRequests: any[]): boolean {
    const requiredDocTypes = ["Aadhaar", "PAN", "DrivingLicense"];
    const verifiedDocTypes = kycRequests
      .filter((kyc) => kyc.isVerified)
      .map((kyc) => kyc.docType);

    return requiredDocTypes.every((docType) =>
      verifiedDocTypes.includes(docType)
    );
  }
}
