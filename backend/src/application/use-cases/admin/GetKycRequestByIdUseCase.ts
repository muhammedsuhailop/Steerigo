import { injectable, inject } from "inversify";
import { IKYCRepository } from "@application/repositories/IAdminDriverKYCRepository";
import { GetKycRequestByIdRequestDto } from "@application/dto/admin/GetKycRequestByIdRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import {
  GetKycRequestByIdResponseDto,
  KycDocumentDto,
  DriverInfoDto,
} from "@application/dto/admin/GetKycRequestByIdResponseDto";

@injectable()
export class GetKycRequestByIdUseCase
  implements
    IUseCase<
      GetKycRequestByIdRequestDto,
      Promise<Result<GetKycRequestByIdResponseDto>>
    >
{
  constructor(
    @inject(TYPES.KYCRepository)
    private kycRepository: IKYCRepository
  ) {}

  async execute(
    dto: GetKycRequestByIdRequestDto
  ): Promise<Result<GetKycRequestByIdResponseDto>> {
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

      const kycDocumentDto = new KycDocumentDto(
        kycWithDriver.kycDocument.getId(),
        kycWithDriver.kycDocument.getDocType(),
        kycWithDriver.kycDocument.getDocNumber(),
        kycWithDriver.kycDocument.getIssueDate()?.toISOString() || null,
        kycWithDriver.kycDocument.getExpiryDate()?.toISOString() || null,
        kycWithDriver.kycDocument.getVerificationStatus(),
        kycWithDriver.kycDocument.getComments() || null,
        kycWithDriver.kycDocument.getDocImageUrlsFront(),
        kycWithDriver.kycDocument.getDocImageUrlsBack(),
        kycWithDriver.kycDocument.getCreatedAt().toISOString(),
        kycWithDriver.kycDocument.getUpdatedAt().toISOString(),
        kycWithDriver.kycDocument.isExpired()
      );

      const driverInfoDto = new DriverInfoDto(
        kycWithDriver.driverInfo.driverId,
        kycWithDriver.driverInfo.userId,
        kycWithDriver.driverInfo.userName,
        kycWithDriver.driverInfo.userEmail,
        kycWithDriver.driverInfo.userMobile,
        kycWithDriver.driverInfo.driverStatus
      );

      const response = new GetKycRequestByIdResponseDto(
        kycDocumentDto,
        driverInfoDto
      );

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
