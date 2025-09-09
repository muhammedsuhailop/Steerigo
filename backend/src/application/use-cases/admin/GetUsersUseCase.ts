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
      const filters = {
        status: dto.status,
        search: dto.search,
        dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : undefined,
        dateTo: dto.dateTo ? new Date(dto.dateTo) : undefined,
      };

      const pagination = {
        page: dto.page,
        pageSize: dto.pageSize,
      };

      const result = await this.adminUserRepository.findUsersOnly(
        filters,
        pagination
      );

      const formattedUsers = result.data.map((user) => ({
        userId: user.userId,
        name: user.name,
        totalBookings: user.totalBookings,
        totalSpent: user.totalSpent,
        status: user.status,
        lastBooked: user.lastBooked
          ? this.formatDate(new Date(user.lastBooked))
          : null,
      }));

      Logger.info("Users fetched successfully", {
        page: dto.page,
        pageSize: dto.pageSize,
        totalItems: result.pagination.totalItems,
      });

      return Result.success({
        users: formattedUsers,
        pagination: result.pagination,
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
