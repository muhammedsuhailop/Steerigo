import { injectable, inject } from "inversify";
import { KYCRepository } from "@application/repositories/AdminDriverKYCRepository";
import { GetKycRequestByIdRequestDto } from "@application/dto/admin/GetKycRequestByIdRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetKycRequestByIdUseCase {
  constructor(
    @inject(TYPES.KYCRepository)
    private kycRepository: KYCRepository
  ) {}

  async execute(dto: GetKycRequestByIdRequestDto): Promise<Result<any>> {
    try {
      Logger.info("Executing GetKycRequestByIdUseCase", {
        kycId: dto.getKycId(),
      });

      const kycWithDriver = await this.kycRepository.findKYCWithDriverInfo(
        dto.getKycId()
      );

      if (!kycWithDriver) {
        return Result.failure(new Error("KYC document not found"));
      }

      const response = {
        kyc: {
          id: kycWithDriver.kycDocument.getId(),
          docType: kycWithDriver.kycDocument.getDocType(),
          docNumber: kycWithDriver.kycDocument.getDocNumber(),
          issueDate:
            kycWithDriver.kycDocument.getIssueDate()?.toISOString() || null,
          expiryDate:
            kycWithDriver.kycDocument.getExpiryDate()?.toISOString() || null,
          verificationStatus: kycWithDriver.kycDocument.getVerificationStatus(),
          comments: kycWithDriver.kycDocument.getComments(),
          docImageUrlsFront: kycWithDriver.kycDocument.getDocImageUrlsFront(),
          docImageUrlsBack: kycWithDriver.kycDocument.getDocImageUrlsBack(),
          createdAt: kycWithDriver.kycDocument.getCreatedAt().toISOString(),
          updatedAt: kycWithDriver.kycDocument.getUpdatedAt().toISOString(),
          isExpired: kycWithDriver.kycDocument.isExpired(),
        },
        driver: {
          driverId: kycWithDriver.driverInfo.driverId,
          userId: kycWithDriver.driverInfo.userId,
          userName: kycWithDriver.driverInfo.userName,
          userEmail: kycWithDriver.driverInfo.userEmail,
          userMobile: kycWithDriver.driverInfo.userMobile,
          driverStatus: kycWithDriver.driverInfo.driverStatus,
        },
      };

      Logger.info("KYC document fetched successfully", {
        kycId: dto.getKycId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching KYC document by ID", error);
      return Result.failure(error as Error);
    }
  }
}
