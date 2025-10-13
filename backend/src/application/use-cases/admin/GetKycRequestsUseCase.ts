import { injectable, inject } from "inversify";
import {
  KYCRepository,
  KYCQuery,
} from "@application/repositories/AdminDriverKYCRepository";
import { GetKycRequestsRequestDto } from "@application/dto/admin/GetKycRequestsRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetKycRequestsUseCase {
  constructor(
    @inject(TYPES.KYCRepository)
    private kycRepository: KYCRepository
  ) {}

  async execute(dto: GetKycRequestsRequestDto): Promise<Result<any>> {
    try {
      const dateFrom = dto.getDateFrom();
      const dateTo = dto.getDateTo();

      if (dateFrom && dateTo && dateFrom > dateTo) {
        return Result.failure(
          new Error(
            "Date range is invalid: 'from' date cannot be after 'to' date"
          )
        );
      }

      const filters: KYCQuery = {
        verificationStatus: dto.getVerificationStatus(),
        docType: dto.getDocType(),
        driverId: dto.getDriverId(),
        dateFrom,
        dateTo,
      };

      const pagination = {
        page: dto.getPage(),
        pageSize: dto.getPageSize(),
      };

      Logger.info("Executing GetKycRequestsUseCase", {
        filters: {
          ...filters,
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
        },
        pagination,
      });

      const result = await this.kycRepository.findKYCDocumentsWithDriverInfo(
        filters,
        pagination
      );

      const response = {
        kycDocuments: result.data.map((item) => ({
          kyc: {
            id: item.kycDocument.getId(),
            docType: item.kycDocument.getDocType(),
            docNumber: item.kycDocument.getDocNumber(),
            issueDate: item.kycDocument.getIssueDate()?.toISOString() || null,
            expiryDate: item.kycDocument.getExpiryDate()?.toISOString() || null,
            verificationStatus: item.kycDocument.getVerificationStatus(),
            comments: item.kycDocument.getComments(),
            docImageUrlsFront: item.kycDocument.getDocImageUrlsFront(),
            docImageUrlsBack: item.kycDocument.getDocImageUrlsBack(),
            createdAt: item.kycDocument.getCreatedAt().toISOString(),
            updatedAt: item.kycDocument.getUpdatedAt().toISOString(),
            isExpired: item.kycDocument.isExpired(),
          },
          driver: {
            driverId: item.driverInfo.driverId,
            userId: item.driverInfo.userId,
            userName: item.driverInfo.userName,
            userEmail: item.driverInfo.userEmail,
            userMobile: item.driverInfo.userMobile,
            driverStatus: item.driverInfo.driverStatus,
          },
        })),
        pagination: result.pagination,
        appliedFilters: {
          sortBy: dto.getSortBy(),
          sortOrder: dto.getSortOrder(),
          verificationStatus: dto.getVerificationStatus() || null,
          docType: dto.getDocType() || null,
          driverId: dto.getDriverId() || null,
          dateFrom: dto.getDateFrom()?.toISOString() || null,
          dateTo: dto.getDateTo()?.toISOString() || null,
        },
      };

      Logger.info("KYC documents fetched successfully", {
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching KYC documents", error);
      return Result.failure(error as Error);
    }
  }
}
