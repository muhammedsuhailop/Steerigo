import { injectable, inject } from "inversify";
import {
  IKYCRepository,
  IKYCQuery,
} from "@domain/repositories/IAdminDriverKYCRepository";
import { GetKycRequestsRequestDto } from "@application/dto/admin/GetKycRequestsRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import {
  GetKycRequestsResponseDto,
  KycDocumentSummaryDto,
  KycDriverInfoDto,
  KycRequestListItemDto,
  PaginationDto,
  KycRequestsAppliedFiltersDto,
} from "@application/dto/admin/GetKycRequestsResponseDto";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";

@injectable()
export class GetKycRequestsUseCase
  implements
    IUseCase<
      GetKycRequestsRequestDto,
      Promise<Result<GetKycRequestsResponseDto>>
    >
{
  constructor(
    @inject(TYPES.KYCRepository)
    private kycRepository: IKYCRepository
  ) {}

  async execute(
    dto: GetKycRequestsRequestDto
  ): Promise<Result<GetKycRequestsResponseDto>> {
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

      const filters: IKYCQuery = {
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

      const kycDocuments: KycRequestListItemDto[] = result.data.map(
        (item) =>
          new KycRequestListItemDto(
            new KycDocumentSummaryDto(
              item.kycDocument.getId(),
              item.kycDocument.getDocType(),
              item.kycDocument.getDocNumber(),
              item.kycDocument.getIssueDate()?.toISOString() || null,
              item.kycDocument.getExpiryDate()?.toISOString() || null,
              item.kycDocument.getVerificationStatus(),
              item.kycDocument.getComments() || null,
              item.kycDocument.getDocImageUrlsFront(),
              item.kycDocument.getDocImageUrlsBack(),
              item.kycDocument.getCreatedAt().toISOString(),
              item.kycDocument.getUpdatedAt().toISOString(),
              item.kycDocument.isExpired()
            ),
            new KycDriverInfoDto(
              item.driverInfo.driverId,
              item.driverInfo.userId,
              item.driverInfo.userName,
              item.driverInfo.userEmail,
              item.driverInfo.userMobile,
              item.driverInfo.driverStatus
            )
          )
      );

      const paginationDto = new PaginationDto(
        result.pagination.currentPage,
        result.pagination.pageSize,
        result.pagination.totalItems,
        result.pagination.totalPages
      );

      const appliedFiltersDto = new KycRequestsAppliedFiltersDto(
        dto.getSortBy(),
        dto.getSortOrder(),
        (dto.getVerificationStatus() as KYCStatus) || null,
        (dto.getDocType() as DocumentType) || null,
        dto.getDriverId() || null,
        dateFrom?.toISOString() || null,
        dateTo?.toISOString() || null
      );

      const response = new GetKycRequestsResponseDto(
        kycDocuments,
        paginationDto,
        appliedFiltersDto
      );

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
