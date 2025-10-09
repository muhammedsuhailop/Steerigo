import { injectable, inject } from "inversify";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { GetDriverProfileRequestDto } from "@application/dto/admin/GetDriverProfileRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetDriverProfileUseCase {
  constructor(
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: AdminDriverRepository,
    @inject(TYPES.KYCRepository)
    private kycRepository: KYCRepository
  ) {}

  async execute(dto: GetDriverProfileRequestDto): Promise<Result<any>> {
    try {
      Logger.info("Executing GetDriverProfileUseCase", {
        driverId: dto.getDriverId(),
      });

      const driverProfile = await this.adminDriverRepository.findDriverProfile(
        dto.getDriverId()
      );

      if (!driverProfile) {
        return Result.failure(new Error("Driver not found"));
      }

      // Get KYC documents
      const kycDocuments = await this.kycRepository.findByDriverId(
        dto.getDriverId()
      );

      const response = {
        driver: {
          id: driverProfile.driver.getId(),
          userId: driverProfile.driver.getUserId(),
          status: driverProfile.driver.getStatus(),
          kycStatus: driverProfile.driver.getKycStatus(),
          licenceCategory: driverProfile.driver.getLicenceCategory(),
          eligibleGearTypes: driverProfile.driver.getEligibleGearTypes(),
          eligibleBodyTypes: driverProfile.driver.getEligibleBodyTypes(),
          licenseIssueDate: driverProfile.driver
            .getLicenseIssueDate()
            .toISOString(),
          licenseExpiryDate: driverProfile.driver
            .getLicenseExpiryDate()
            .toISOString(),
          createdAt: driverProfile.driver.getCreatedAt().toISOString(),
          updatedAt: driverProfile.driver.getUpdatedAt().toISOString(),
        },
        user: {
          id: driverProfile.user.id,
          name: driverProfile.user.name,
          email: driverProfile.user.email,
          mobile: driverProfile.user.mobile,
        },
        stats: {
          totalRides: driverProfile.stats.totalRides,
          totalEarnings: driverProfile.stats.totalEarnings,
          rating: driverProfile.stats.rating,
          lastRideDate: driverProfile.stats.lastRideDate?.toISOString() || null,
        },
        kycDocuments: kycDocuments.map((kyc) => ({
          id: kyc.getId(),
          docType: kyc.getDocType(),
          docNumber: kyc.getDocNumber(),
          issueDate: kyc.getIssueDate()?.toISOString() || null,
          expiryDate: kyc.getExpiryDate()?.toISOString() || null,
          verificationStatus: kyc.getVerificationStatus(),
          comments: kyc.getComments(),
          isExpired: kyc.isExpired(),
          createdAt: kyc.getCreatedAt().toISOString(),
          updatedAt: kyc.getUpdatedAt().toISOString(),
        })),
      };

      Logger.info("Driver profile fetched successfully", {
        driverId: dto.getDriverId(),
        kycDocumentsCount: kycDocuments.length,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver profile", error);
      return Result.failure(error as Error);
    }
  }
}
