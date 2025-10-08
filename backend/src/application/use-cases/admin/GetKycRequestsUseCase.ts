import { injectable, inject } from "inversify";
import {
  KYCRepository,
  KYCQuery,
} from "@application/repositories/KYCRepository";
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
        status: dto.getStatus(),
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

      const result = await this.kycRepository.findKYCRequestsWithDriverInfo(
        filters,
        pagination
      );

      const response = {
        kycRequests: result.data.map((item) => ({
          kyc: {
            id: item.kycRequest.getId(),
            status: item.kycRequest.getStatus(),
            documents: item.kycRequest.getDocuments(),
            comments: item.kycRequest.getComments(),
            reviewedBy: item.kycRequest.getReviewedBy(),
            reviewedAt: item.kycRequest.getReviewedAt()?.toISOString() || null,
            createdAt: item.kycRequest.getCreatedAt().toISOString(),
            updatedAt: item.kycRequest.getUpdatedAt().toISOString(),
          },
          driver: {
            driverId: item.driverInfo.driverId,
            driverName: item.driverInfo.driverName,
            driverEmail: item.driverInfo.driverEmail,
            driverMobile: item.driverInfo.driverMobile,
          },
        })),
        pagination: result.pagination,
        appliedFilters: {
          sortBy: dto.getSortBy(),
          sortOrder: dto.getSortOrder(),
          status: dto.getStatus() || null,
          driverId: dto.getDriverId() || null,
          dateFrom: dto.getDateFrom()?.toISOString() || null,
          dateTo: dto.getDateTo()?.toISOString() || null,
        },
      };

      Logger.info("KYC requests fetched successfully", {
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching KYC requests", error);
      return Result.failure(error as Error);
    }
  }
}
