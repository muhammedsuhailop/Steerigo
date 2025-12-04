import { injectable, inject } from "inversify";
import { IAdminDriverRepository } from "@application/repositories/IAdminDriverRepository";
import {
  AdminDriverQuery,
  GetDriversRequestDto,
} from "@application/dto/admin/GetDriversRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import {
  GetDriversResponseDto,
  DriverSummaryDto,
  DriverUserSummary,
  DriverStatusInfo,
  DriverLicenseInfo,
  DriverPerformanceStats,
  PaginationDto,
  AppliedFiltersDto,
} from "@application/dto/admin/GetDriversResponseDto";

@injectable()
export class GetDriversUseCase
  implements
    IUseCase<GetDriversRequestDto, Promise<Result<GetDriversResponseDto>>>
{
  constructor(
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: IAdminDriverRepository
  ) {}

  async execute(
    dto: GetDriversRequestDto
  ): Promise<Result<GetDriversResponseDto>> {
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

      const filters: AdminDriverQuery = {
        status: dto.getStatus(),
        kycStatus: dto.getKycStatus(),
        licenceCategory: dto.getLicenceCategory(),
        search: dto.getSearch(),
        dateFrom,
        dateTo,
      };

      const pagination = {
        page: dto.getPage(),
        pageSize: dto.getPageSize(),
      };

      Logger.info("Executing GetDriversUseCase", {
        filters: {
          ...filters,
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
        },
        pagination,
      });

      const result = await this.adminDriverRepository.findDriversWithSummary(
        filters,
        pagination
      );

      const drivers: DriverSummaryDto[] = result.data.map(
        (driver) =>
          new DriverSummaryDto(
            driver.driverId,
            new DriverUserSummary(
              driver.userId,
              driver.userName,
              driver.userEmail,
              driver.userMobile
            ),
            new DriverStatusInfo(
              driver.status,
              driver.kycStatus,
              driver.licenceCategory,
              driver.eligibleGearTypes,
              driver.eligibleBodyTypes
            ),
            new DriverLicenseInfo(
              driver.licenseIssueDate,
              driver.licenseExpiryDate
            ),
            new DriverPerformanceStats(
              driver.totalRides,
              driver.totalEarnings,
              driver.rating,
              driver.lastRideDate || null
            ),
            driver.createdAt
          )
      );

      const paginationDto = new PaginationDto(
        result.pagination.currentPage,
        result.pagination.pageSize,
        result.pagination.totalItems,
        result.pagination.totalPages
      );

      const appliedFiltersDto = new AppliedFiltersDto(
        dto.getSortBy(),
        dto.getSortOrder(),
        dto.getSearch() || null,
        dto.getStatus() || null,
        dto.getKycStatus() || null,
        dto.getLicenceCategory() || null,
        dateFrom?.toISOString() || null,
        dateTo?.toISOString() || null
      );

      const response = new GetDriversResponseDto(
        drivers,
        paginationDto,
        appliedFiltersDto
      );

      Logger.info("Drivers fetched successfully", {
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching drivers", error);
      return Result.failure(error as Error);
    }
  }
}
