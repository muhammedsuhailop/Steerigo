import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IKYCRepository } from "@domain/repositories/IKYCRepository";
import { GetDriverProfileRequestDto } from "@application/dto/driver/GetDriverProfileRequestDto";
import {
  GetDriverProfileResponseDto,
  DriverProfileData,
  LicenseInfo,
  KycInfo,
} from "@application/dto/driver/GetDriverProfileResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  DriverProfileNotFoundError,
  UserNotFoundError,
} from "@domain/errors/DriverProfileErrors";
import { KYC } from "@domain/entities/KYC";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetDriverDetailedProfileUseCase
  implements
    IUseCase<
      GetDriverProfileRequestDto,
      Promise<Result<GetDriverProfileResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.KYCRepository) private kycRepository: IKYCRepository
  ) {}

  async execute(
    dto: GetDriverProfileRequestDto
  ): Promise<Result<GetDriverProfileResponseDto>> {
    try {
      if (!dto.isValid()) {
        Logger.warn("Invalid driver profile request", {
          userId: dto.getUserId(),
        });
        return Result.failure(new DomainError("Invalid user ID provided"));
      }

      const userId = dto.getUserId();
      Logger.info("Get driver detailed profile started", { userId });

      const [driver, user] = await Promise.all([
        this.driverRepository.findByUserId(userId),
        this.userRepository.findById(userId),
      ]);

      if (!user) {
        Logger.warn("User not found", { userId });
        return Result.failure(new UserNotFoundError(userId));
      }

      if (!driver) {
        Logger.warn("Driver profile not found", { userId });
        return Result.failure(new DriverProfileNotFoundError(userId));
      }

      let kycDocuments: KYC[] = [];
      try {
        kycDocuments = await this.kycRepository.findByDriverId(driver.getId());
      } catch (error) {
        Logger.warn("Unable to fetch KYC documents", {
          driverId: driver.getId(),
          error,
        });
      }

      const licenseInfo: LicenseInfo = {
        licenseNumber: driver.getLicenseNumber(),
        licenceCategory: driver.getLicenceCategory(),
        licenseIssueDate: driver.getLicenseIssueDate(),
        licenseExpiryDate: driver.getLicenseExpiryDate(),
        licenseVerified: driver.getKycStatus() === "Approved",
      };

      const kycInfo: KycInfo = {
        overallStatus: driver.getKycStatus(),
        docs: kycDocuments.map((kyc) => ({
          docId: kyc.getId(),
          docType: kyc.getDocumentType?.() ?? "",
          docNumberMasked: this.maskDocumentNumber(
            kyc.getDocumentNumber?.() ?? ""
          ),
          issueDate: kyc.getIssueDate?.(),
          expiryDate: kyc.getExpiryDate?.(),
          docImageUrlsFront: kyc.getDocImageUrlsFront?.() ?? [],
          docImageUrlsBack: kyc.getDocImageUrlsBack?.() ?? [],
          verificationStatus: kyc.getVerificationStatus?.() ?? "Pending",
          createdAt: kyc.getCreatedAt(),
          updatedAt: kyc.getUpdatedAt(),
          comments: kyc.getComments(),
        })),
      };

      const profileData: DriverProfileData = {
        driverId: driver.getId(),
        userId: userId,
        name: user.getName(),
        profileImageUrl: user.getProfilePicture() || "",
        email: user.getEmailValue(),
        mobile: user.getMobile() || "",
        dob: user.getDob() || new Date(),
        gender: user.getGender() || "",
        address: user.getAddress() || "",
        role: user.getRole(),
        status: driver.getStatus(),
        isVerified: user.getIsVerified(),
        authProvider: user.getAuthProvider(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
        license: licenseInfo,
        kyc: kycInfo,
        eligibleGearTypes: driver.getEligibleGearTypes(),
        eligibleBodyTypes: driver.getEligibleBodyTypes(),
        meta: {
          lastUpdated: user.getUpdatedAt(),
          serverTime: new Date(),
        },
      };

      const response = new GetDriverProfileResponseDto(profileData);

      Logger.info("Driver detailed profile fetched successfully", {
        userId,
        driverId: driver.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Get driver detailed profile failed", {
        userId: dto.getUserId(),
        error,
      });
      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError("Failed to fetch driver profile")
      );
    }
  }

  private maskDocumentNumber(docNumber: string): string {
    if (!docNumber || docNumber.length <= 4) return "****";
    return "****" + docNumber.slice(-4);
  }
}
