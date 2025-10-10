import { injectable, inject } from "inversify";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import {
  AdminDriverQuery,
  GetDriversRequestDto,
} from "@application/dto/admin/GetDriversRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetDriversUseCase {
  constructor(
    @inject(TYPES.AdminDriverRepository)
    private adminDriverRepository: AdminDriverRepository
  ) {}

  async execute(dto: GetDriversRequestDto): Promise<Result<any>> {
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

      const response = {
        drivers: result.data.map((driver) => ({
          driverId: driver.driverId,
          userId: driver.userId,
          userName: driver.userName,
          userEmail: driver.userEmail,
          userMobile: driver.userMobile,
          status: driver.status,
          kycStatus: driver.kycStatus,
          licenceCategory: driver.licenceCategory,
          eligibleGearTypes: driver.eligibleGearTypes,
          eligibleBodyTypes: driver.eligibleBodyTypes,
          licenseIssueDate: driver.licenseIssueDate.toISOString(),
          licenseExpiryDate: driver.licenseExpiryDate.toISOString(),
          totalRides: driver.totalRides,
          totalEarnings: driver.totalEarnings,
          rating: driver.rating,
          lastRideDate: driver.lastRideDate?.toISOString() || null,
          createdAt: driver.createdAt.toISOString(),
        })),
        pagination: result.pagination,
        appliedFilters: {
          sortBy: dto.getSortBy(),
          sortOrder: dto.getSortOrder(),
          search: dto.getSearch() || null,
          status: dto.getStatus() || null,
          kycStatus: dto.getKycStatus() || null,
          licenceCategory: dto.getLicenceCategory() || null,
          dateFrom: dto.getDateFrom()?.toISOString() || null,
          dateTo: dto.getDateTo()?.toISOString() || null,
        },
      };

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
