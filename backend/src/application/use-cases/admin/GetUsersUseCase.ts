import { injectable, inject } from "inversify";
import { AdminUserRepository } from "@application/repositories/AdminUserRepository";
import {
  AdminUsersQuery,
  GetUsersRequestDto,
} from "@application/dto/admin/GetUsersRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetUsersUseCase {
  constructor(
    @inject(TYPES.AdminUserRepository)
    private adminUserRepository: AdminUserRepository
  ) {}

  async execute(dto: GetUsersRequestDto): Promise<Result<any>> {
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

      const filters: AdminUsersQuery = {
        status: dto.getStatus(),
        search: dto.getSearch(),
        dateFrom,
        dateTo,
      };

      const pagination = {
        page: dto.getPage(),
        pageSize: dto.getPageSize(),
      };

      Logger.info("Executing GetUsersUseCase", {
        filters: {
          ...filters,
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
        },
        pagination,
      });

      const result = await this.adminUserRepository.findUsersWithSummary(
        filters,
        pagination
      );

      const response = {
        users: result.data.map((user) => ({
          userId: user.userId,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          status: user.status,
          totalBookings: user.totalBookings,
          totalSpent: user.totalSpent,
          lastBooked: user.lastBooked?.toISOString() || null,
          createdAt: user.createdAt.toISOString(),
          isVerified: user.isVerified,
        })),
        pagination: result.pagination,
        appliedFilters: {
          sortBy: dto.getSortBy(),
          sortOrder: dto.getSortOrder(),
          search: dto.getSearch() || null,
          status: dto.getStatus() || null,
          dateFrom: dto.getDateFrom()?.toISOString() || null,
          dateTo: dto.getDateTo()?.toISOString() || null,
        },
      };

      Logger.info("Users fetched successfully", {
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching users", error);
      return Result.failure(error as Error);
    }
  }
}
