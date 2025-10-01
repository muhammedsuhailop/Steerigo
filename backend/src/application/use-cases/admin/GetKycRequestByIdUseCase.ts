import { injectable, inject } from "inversify";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { IAdminKycRepository } from "@domain/repositories/admin/IAdminKycRepository";
import { GetKycRequestByIdDto } from "../../dto/admin/GetKycRequestByIdDto";

@injectable()
export class GetKycRequestByIdUseCase {
  constructor(
    @inject("IAdminKycRepository")
    private readonly kycRepo: IAdminKycRepository
  ) {}

  async execute(dto: GetKycRequestByIdDto): Promise<Result<any>> {
    try {
      Logger.info("GetKycRequestByIdUseCase start", { kycId: dto.kycId });

      const kyc = await this.kycRepo.findKycRequestDetailedById(dto.kycId);
      if (!kyc) {
        return Result.failure(new Error("KYC request not found"));
      }

      const response = {
        kycId: kyc.kycId,
        driverId: kyc.driverId,
        driverName: kyc.driverName,
        driverEmail: kyc.driverEmail,
        docType: kyc.docType,
        docNumber: kyc.docNumber,
        issueDate: kyc.issueDate,
        expiryDate: kyc.expiryDate,
        docImageUrls: kyc.docImageUrls,
        isVerified: kyc.isVerified,
        comments: kyc.comments,
        createdAt: kyc.createdAt,
        updatedAt: kyc.updatedAt,
        verifiedAt: kyc.verifiedAt ?? null,
      };

      Logger.info("GetKycRequestByIdUseCase success", { kycId: dto.kycId });
      return Result.success(response);
    } catch (error) {
      Logger.error("GetKycRequestByIdUseCase error", error);
      return Result.failure(error as Error);
    }
  }
}
