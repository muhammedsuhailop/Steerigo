import { injectable, inject } from "inversify";
import { IAdminUserRepository } from "@domain/repositories/admin/IAdminUserRepository";
import { GetUsersDto } from "../../dto/admin/GetUsersDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class GetUsersUseCase {
  constructor(
    @inject("IAdminUserRepository")
    private adminUserRepository: IAdminUserRepository
  ) {}

  async execute(dto: GetUsersDto): Promise<Result<any>> {
    try {
      if (dto.dateFrom && dto.dateTo) {
        const fromDate = new Date(dto.dateFrom);
        const toDate = new Date(dto.dateTo);

        if (fromDate > toDate) {
          return Result.failure(
            new Error(
              "Date range is invalid: 'from' date cannot be after 'to' date"
            )
          );
        }
      }

      const filters = {
        status: dto.status,
        search: dto.search,
        dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : undefined,
        dateTo: dto.dateTo ? new Date(dto.dateTo) : undefined,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
      };

      const pagination = {
        page: dto.page,
        pageSize: dto.pageSize,
      };

      Logger.info("Executing GetUsersUseCase", {
        filters: {
          ...filters,
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
        },
        pagination,
      });

      const result = await this.adminUserRepository.findUsersOnly(
        filters,
        pagination
      );

      const formattedUsers = result.data.map((user) => ({
        userId: user.userId,
        name: user.name,
        email: user.email,
        totalBookings: user.totalBookings,
        totalSpent: user.totalSpent,
        status: user.status,
        lastBooked: user.lastBooked
          ? this.formatDate(new Date(user.lastBooked))
          : null,
        createdAt: user.joinedDate
          ? user.joinedDate.toISOString()
          : new Date().toISOString(),
        isVerified: user.isVerified,
      }));

      Logger.info("Users fetched successfully", {
        page: dto.page,
        pageSize: dto.pageSize,
        totalItems: result.pagination.totalItems,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
        filtersApplied: {
          hasSearch: !!dto.search,
          hasStatus: !!dto.status,
          hasDateRange: !!(dto.dateFrom || dto.dateTo),
        },
      });

      return Result.success({
        users: formattedUsers,
        pagination: result.pagination,
        appliedFilters: {
          sortBy: dto.sortBy,
          sortOrder: dto.sortOrder,
          search: dto.search || null,
          status: dto.status || null,
          dateFrom: dto.dateFrom || null,
          dateTo: dto.dateTo || null,
        },
      });
    } catch (error) {
      Logger.error("Error fetching users", error);
      return Result.failure(error as Error);
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}
