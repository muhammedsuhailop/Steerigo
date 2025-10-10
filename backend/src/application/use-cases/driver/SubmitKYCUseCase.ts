import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { KYCResponseDto } from "@application/dto/driver/KYCResponseDto";
import { Result } from "@shared/utils/Result";
import { KYC } from "@domain/entities/KYC";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class SubmitKYCUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.KYCRepository) private kycRepository: KYCRepository
  ) {}

  async execute(
    userId: string,
    dto: KYCSubmissionRequestDto
  ): Promise<Result<KYCResponseDto>> {
    try {
      Logger.info("KYC submission started", {
        userId,
        docType: dto.getDocType(),
      });

      // Validate driver exists
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(new DomainError("Driver profile not found"));
      }

      // Check if KYC for this document type already exists
      const existingKYC = await this.kycRepository.findByDriverAndDocType(
        driver.getId(),
        dto.getDocType()
      );

      let kyc: KYC;
      if (existingKYC) {
        // Update existing KYC document
        existingKYC.updateDocument(
          dto.getDocType(),
          dto.getDocNumber(),
          dto.getIssueDate(),
          dto.getExpiryDate()
        );
        existingKYC.updateDocumentImages(
          dto.getFrontImageUrls(),
          dto.getBackImageUrls()
        );
        kyc = existingKYC;
      } else {
        // Create new KYC document
        kyc = KYC.create(
          uuidv4(),
          driver.getId(),
          dto.getDocType(),
          dto.getDocNumber(),
          dto.getIssueDate(),
          dto.getExpiryDate(),
          dto.getFrontImageUrls(),
          dto.getBackImageUrls()
        );
      }

      const savedKYC = await this.kycRepository.save(kyc);

      if (!savedKYC) {
        return Result.failure(new DomainError("Failed to save KYC"));
      }

      const response: KYCResponseDto = {
        id: savedKYC.getId(),
        driverId: savedKYC.getDriverId(),
        docType: savedKYC.getDocType(),
        docNumber: savedKYC.getDocNumber(),
        issueDate: savedKYC.getIssueDate(),
        expiryDate: savedKYC.getExpiryDate(),
        verificationStatus: savedKYC.getVerificationStatus(),
        comments: savedKYC.getComments(),
        docImageUrlsFront: savedKYC.getDocImageUrlsFront(),
        docImageUrlsBack: savedKYC.getDocImageUrlsBack(),
        createdAt: savedKYC.getCreatedAt(),
        updatedAt: savedKYC.getUpdatedAt(),
      };

      Logger.info("KYC submission successful", {
        userId,
        driverId: driver.getId(),
        kycId: savedKYC.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("KYC submission failed", { userId, error });
      return Result.failure(error as Error);
    }
  }
}
