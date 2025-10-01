import { injectable, inject } from "inversify";
import { IAdminDriverRepository } from "@domain/repositories/admin/IAdminDriverRepository";
import { IAdminKycRepository } from "@domain/repositories/admin/IAdminKycRepository";
import { GetDriverProfileDto } from "../../dto/admin/GetDriverProfileDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class GetDriverProfileUseCase {
  constructor(
    @inject("IAdminDriverRepository")
    private adminDriverRepository: IAdminDriverRepository,
    @inject("IAdminKycRepository")
    private adminKycRepository: IAdminKycRepository
  ) {}

  async execute(dto: GetDriverProfileDto): Promise<Result<any>> {
    try {
      Logger.info("GetDriverProfileUseCase started", {
        driverId: dto.driverId,
      });

      const driverWithUser =
        await this.adminDriverRepository.findDriverWithUser(dto.driverId);

      if (!driverWithUser) {
        return Result.failure(new Error("Driver not found"));
      }

      const driverStats = await this.adminDriverRepository.getDriverStats(
        dto.driverId
      );

      const kycRequests =
        await this.adminKycRepository.findKycRequestsByDriverId(dto.driverId, {
          page: 1,
          pageSize: 50,
        });

      const profile = {
        id: driverWithUser.driver._id,
        user: {
          name: driverWithUser.user.name,
          email: driverWithUser.user.email,
          mobile: driverWithUser.user.mobile,
          status: driverWithUser.user.status,
          isVerified: driverWithUser.user.isVerified,
          joinedDate: driverWithUser.user.createdAt,
          lastActive: driverWithUser.user.updatedAt,
        },
        driver: {
          licenseNumber: driverWithUser.driver.licenseNumber,
          licenseIssueDate: driverWithUser.driver.licenseIssueDate,
          licenseExpiryDate: driverWithUser.driver.licenseExpiryDate,
          licenseCategory: driverWithUser.driver.licenseCategory,
          status: driverWithUser.driver.status,
          kycStatus: driverWithUser.driver.kycStatus,
          eligibleVehicleType: driverWithUser.driver.eligibleVehicleType,
          eligibleGearType: driverWithUser.driver.eligibleGearType,
          statistics: {
            totalRides: driverStats.totalRides || 0,
            totalEarned: driverStats.totalEarned || 0,
            lastRideDate: driverStats.lastRideDate || null,
          },
          createdAt: driverWithUser.driver.createdAt,
          updatedAt: driverWithUser.driver.updatedAt,
        },
        kycDocuments: kycRequests.data.map((kyc) => ({
          id: kyc.kycId,
          driverId: kyc.driverId,
          documentType: kyc.docType,
          documentNumber: kyc.docNumber,
          issueDate: kyc.issueDate,
          expiryDate: kyc.expiryDate,
          documentImageUrls: kyc.docImageUrls,
          isVerified: kyc.isVerified,
          comments: kyc.comments,
          submittedAt: kyc.createdAt,
        })),
        summary: {
          totalKycDocuments: kycRequests.data.length,
          verifiedDocuments: kycRequests.data.filter((k) => k.isVerified)
            .length,
          pendingDocuments: kycRequests.data.filter((k) => !k.isVerified)
            .length,
          kycCompletionStatus: this.calculateKycCompletionStatus(
            kycRequests.data
          ),
        },
      };

      Logger.info("GetDriverProfileUseCase completed", {
        driverId: dto.driverId,
        totalKycDocuments: kycRequests.data.length,
      });

      return Result.success(profile);
    } catch (error) {
      Logger.error("Error in GetDriverProfileUseCase", error);
      return Result.failure(error as Error);
    }
  }

  private calculateKycCompletionStatus(kycRequests: any[]): string {
    const requiredDocTypes = ["Aadhaar", "PAN", "DrivingLicense"];
    const verifiedDocTypes = kycRequests
      .filter((kyc) => kyc.isVerified)
      .map((kyc) => kyc.docType);

    const completedRequired = requiredDocTypes.filter((type) =>
      verifiedDocTypes.includes(type)
    );

    const completionPercentage =
      (completedRequired.length / requiredDocTypes.length) * 100;

    if (completionPercentage === 100) return "Complete";
    if (completionPercentage >= 66) return "Mostly Complete";
    if (completionPercentage >= 33) return "Partially Complete";
    return "Incomplete";
  }
}
