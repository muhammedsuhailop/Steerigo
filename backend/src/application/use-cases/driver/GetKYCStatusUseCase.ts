import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { KYCResponseDto } from "@application/dto/driver/KYCResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetKYCStatusUseCase
  implements IUseCase<string, Promise<Result<KYCResponseDto[]>>>
{
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.KYCRepository) private kycRepository: KYCRepository
  ) {}

  async execute(userId: string): Promise<Result<KYCResponseDto[]>> {
    try {
      Logger.info("Get KYC status started", { userId });

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(new DomainError("Driver profile not found"));
      }

      const kycDocuments = await this.kycRepository.findByDriverId(
        driver.getId()
      );

      const response: KYCResponseDto[] = kycDocuments.map((kyc) => ({
        id: kyc.getId(),
        driverId: kyc.getDriverId(),
        docType: kyc.getDocType(),
        docNumber: kyc.getDocNumber(),
        issueDate: kyc.getIssueDate(),
        expiryDate: kyc.getExpiryDate(),
        verificationStatus: kyc.getVerificationStatus(),
        comments: kyc.getComments(),
        docImageUrlsFront: kyc.getDocImageUrlsFront(),
        docImageUrlsBack: kyc.getDocImageUrlsBack(),
        createdAt: kyc.getCreatedAt(),
        updatedAt: kyc.getUpdatedAt(),
      }));

      Logger.info("Get KYC status successful", {
        userId,
        driverId: driver.getId(),
        documentCount: kycDocuments.length,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Get KYC status failed", { userId, error });
      return Result.failure(error as Error);
    }
  }
}
