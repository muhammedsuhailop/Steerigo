import { injectable, inject } from "inversify";
import { IAdminUserRepository } from "@domain/repositories/IAdminUserRepository";
import {
  AdminUsersQuery,
  GetUsersRequestDto,
} from "@application/dto/admin/GetUsersRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import {
  GetUsersResponseDto,
  AdminUserSummaryDto,
  AdminUsersPaginationDto,
  AdminUsersAppliedFiltersDto,
} from "@application/dto/admin/GetUsersResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";

@injectable()
export class GetUsersUseCase implements IUseCase<
  GetUsersRequestDto,
  Promise<Result<GetUsersResponseDto>>
> {
  constructor(
    @inject(TYPES.AdminUserRepository)
    private adminUserRepository: IAdminUserRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
  ) {}

  async execute(dto: GetUsersRequestDto): Promise<Result<GetUsersResponseDto>> {
    try {
      const dateFrom = dto.getDateFrom();
      const dateTo = dto.getDateTo();

      if (dateFrom && dateTo && dateFrom > dateTo) {
        return Result.failure(
          new Error(
            "Date range is invalid: 'from' date cannot be after 'to' date",
          ),
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
        pagination,
      );

      const usersWithStats = await Promise.all(
        result.data.map(async (user) => {
          try {
            const rideStats = await this.rideRepository.countByRiderStats(
              user.userId,
              {
                fromDate: undefined,
                toDate: undefined,
              },
            );

            return {
              ...user,
              totalBookings: rideStats.total,
              totalSpent: rideStats.totalSpend,
            };
          } catch (statsError) {
            Logger.error(
              `Failed loading dynamic stats for user: ${user.userId}`,
              {
                message:
                  statsError instanceof Error
                    ? statsError.message
                    : String(statsError),
              },
            );
            return {
              ...user,
              totalBookings: user.totalBookings || 0,
              totalSpent: user.totalSpent || 0,
            };
          }
        }),
      );

      const users: AdminUserSummaryDto[] = usersWithStats.map(
        (user) =>
          new AdminUserSummaryDto(
            user.userId,
            user.name,
            user.email,
            user.mobile,
            user.status,
            user.totalBookings,
            user.totalSpent,
            user.lastBooked?.toISOString() || null,
            user.createdAt.toISOString(),
            user.isVerified,
          ),
      );

      const paginationDto = new AdminUsersPaginationDto(
        result.pagination.currentPage,
        result.pagination.pageSize,
        result.pagination.totalItems,
        result.pagination.totalPages,
      );

      const appliedFiltersDto = new AdminUsersAppliedFiltersDto(
        dto.getSortBy(),
        dto.getSortOrder(),
        dto.getSearch() || null,
        dto.getStatus() || null,
        dateFrom?.toISOString() || null,
        dateTo?.toISOString() || null,
      );

      const response = new GetUsersResponseDto(
        users,
        paginationDto,
        appliedFiltersDto,
      );

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
