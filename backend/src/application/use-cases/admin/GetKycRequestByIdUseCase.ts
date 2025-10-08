import { injectable, inject } from "inversify";
import { KYCRepository } from "@application/repositories/KYCRepository";
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
        return Result.failure(new Error("KYC request not found"));
      }

      const response = {
        kyc: {
          id: kycWithDriver.kycRequest.getId(),
          status: kycWithDriver.kycRequest.getStatus(),
          documents: kycWithDriver.kycRequest.getDocuments(),
          comments: kycWithDriver.kycRequest.getComments(),
          reviewedBy: kycWithDriver.kycRequest.getReviewedBy(),
          reviewedAt:
            kycWithDriver.kycRequest.getReviewedAt()?.toISOString() || null,
          createdAt: kycWithDriver.kycRequest.getCreatedAt().toISOString(),
          updatedAt: kycWithDriver.kycRequest.getUpdatedAt().toISOString(),
        },
        driver: {
          driverId: kycWithDriver.driverInfo.driverId,
          driverName: kycWithDriver.driverInfo.driverName,
          driverEmail: kycWithDriver.driverInfo.driverEmail,
          driverMobile: kycWithDriver.driverInfo.driverMobile,
        },
      };

      Logger.info("KYC request fetched successfully", {
        kycId: dto.getKycId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching KYC request by ID", error);
      return Result.failure(error as Error);
    }
  }
}
