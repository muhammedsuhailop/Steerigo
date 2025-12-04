import { injectable, inject } from "inversify";
import { IAdminDriverRepository } from "@application/repositories/IAdminDriverRepository";
import { IKYCRepository } from "@application/repositories/IAdminDriverKYCRepository";
import { GetDriverProfileRequestDto } from "@application/dto/admin/GetDriverProfileRequestDto";
import {
  AdminGetDriverProfileResponseDto,
  AdminDriverInfo,
  AdminUserInfo,
  AdminKycDocument,
  DriverStatistics,
} from "@application/dto/admin/GetDriverProfileResponseDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DomainError } from "@domain/errors/DomainError";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetDriverProfileUseCase
  implements
    IUseCase<
      GetDriverProfileRequestDto,
      Promise<Result<AdminGetDriverProfileResponseDto>>
    >
{
  constructor(
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: IAdminDriverRepository,
    @inject(TYPES.KYCRepository)
    private kycRepository: IKYCRepository
  ) {}

  async execute(
    dto: GetDriverProfileRequestDto
  ): Promise<Result<AdminGetDriverProfileResponseDto>> {
    try {
      Logger.info("Executing GetDriverProfileUseCase", {
        driverId: dto.getDriverId(),
      });

      const driverProfile = await this.adminDriverRepository.findDriverProfile(
        dto.getDriverId()
      );

      if (!driverProfile) {
        Logger.warn("Driver profile not found", {
          driverId: dto.getDriverId(),
        });
        return Result.failure(new DomainError("Driver not found"));
      }

      const kycDocuments = await this.kycRepository.findByDriverId(
        dto.getDriverId()
      );

      const driverInfo = new AdminDriverInfo(
        driverProfile.driver.getId(),
        driverProfile.driver.getUserId(),
        driverProfile.driver.getStatus(),
        driverProfile.driver.getKycStatus(),
        driverProfile.driver.getLicenceCategory(),
        driverProfile.driver.getEligibleGearTypes(),
        driverProfile.driver.getEligibleBodyTypes(),
        driverProfile.driver.getLicenseIssueDate(),
        driverProfile.driver.getLicenseExpiryDate(),
        driverProfile.driver.getCreatedAt(),
        driverProfile.driver.getUpdatedAt()
      );

      const userInfo = new AdminUserInfo(
        driverProfile.user.id,
        driverProfile.user.name,
        driverProfile.user.email,
        driverProfile.user.mobile,
        driverProfile.user.profilePicture
      );

      const stats = new DriverStatistics(
        driverProfile.stats.totalRides,
        driverProfile.stats.totalEarnings,
        driverProfile.stats.rating,
        driverProfile.stats.lastRideDate || null
      );

      const mappedKycDocuments: AdminKycDocument[] = kycDocuments.map(
        (kyc) =>
          new AdminKycDocument(
            kyc.getId(),
            kyc.getDocType(),
            kyc.getDocNumber(),
            kyc.getIssueDate() || null,
            kyc.getExpiryDate() || null,
            kyc.getVerificationStatus(),
            kyc.getComments() || null,
            kyc.isExpired(),
            kyc.getCreatedAt(),
            kyc.getUpdatedAt()
          )
      );

      const response = new AdminGetDriverProfileResponseDto(
        driverInfo,
        userInfo,
        stats,
        mappedKycDocuments
      );

      Logger.info("Admin driver profile fetched successfully", {
        driverId: dto.getDriverId(),
        kycDocumentsCount: kycDocuments.length,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching admin driver profile", {
        driverId: dto.getDriverId(),
        error,
      });

      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError("Failed to fetch driver profile")
      );
    }
  }
}
