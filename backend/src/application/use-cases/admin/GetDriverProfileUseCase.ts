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

      // Get KYC information
      const kycRequest = await this.kycRepository.findByDriverId(
        dto.getDriverId()
      );

      const response = {
        driver: {
          id: driverProfile.driver.getId(),
          userId: driverProfile.driver.getUserId(),
          name: driverProfile.driver.getName(),
          email: driverProfile.driver.getEmail(),
          mobile: driverProfile.driver.getMobile(),
          licenseNumber: driverProfile.driver.getLicenseNumber(),
          vehicleNumber: driverProfile.driver.getVehicleNumber(),
          status: driverProfile.driver.getStatus(),
          profilePicture: driverProfile.driver.getProfilePicture(),
          licenseDocument: driverProfile.driver.getLicenseDocument(),
          vehicleDocument: driverProfile.driver.getVehicleDocument(),
          createdAt: driverProfile.driver.getCreatedAt().toISOString(),
          updatedAt: driverProfile.driver.getUpdatedAt().toISOString(),
        },
        stats: {
          totalRides: driverProfile.stats.totalRides,
          totalEarnings: driverProfile.stats.totalEarnings,
          rating: driverProfile.stats.rating,
          lastRideDate: driverProfile.stats.lastRideDate?.toISOString() || null,
        },
        kyc: kycRequest
          ? {
              id: kycRequest.getId(),
              status: kycRequest.getStatus(),
              documents: kycRequest.getDocuments(),
              comments: kycRequest.getComments(),
              reviewedBy: kycRequest.getReviewedBy(),
              reviewedAt: kycRequest.getReviewedAt()?.toISOString() || null,
              createdAt: kycRequest.getCreatedAt().toISOString(),
              updatedAt: kycRequest.getUpdatedAt().toISOString(),
            }
          : null,
      };

      Logger.info("Driver profile fetched successfully", {
        driverId: dto.getDriverId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver profile", error);
      return Result.failure(error as Error);
    }
  }
}
