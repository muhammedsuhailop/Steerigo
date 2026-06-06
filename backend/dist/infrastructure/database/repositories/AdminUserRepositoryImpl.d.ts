import { IAdminUserRepository, IAdminUserSummary } from "../../../domain/repositories/IAdminUserRepository";
import { User } from "../../../domain/entities/User";
import { QueryOptions, PaginatedResult, FilterOptions } from "../../../shared/types/Repository";
type AdminFilterOptions = FilterOptions<User> & {
    status?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
};
export declare class AdminUserRepositoryImpl implements IAdminUserRepository {
    findById(id: string): Promise<User | null>;
    exists(id: string): Promise<boolean>;
    findByIds(ids: string[]): Promise<User[]>;
    findAll(options?: QueryOptions<User>): Promise<User[]>;
    count(filters?: AdminFilterOptions): Promise<number>;
    existsByFilter(filters: AdminFilterOptions): Promise<boolean>;
    findPaginated(options: QueryOptions<User> & {
        filters?: AdminFilterOptions;
    }): Promise<PaginatedResult<User>>;
    findUsersWithSummary(filters: AdminFilterOptions, pagination: {
        page: number;
        pageSize: number;
    }, sortBy?: string, sortOrder?: "asc" | "desc"): Promise<{
        data: IAdminUserSummary[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    updateUserStatus(userId: string, status: string, reason?: string): Promise<boolean>;
    getUserStats(userId: string): Promise<{
        totalBookings: number;
        totalSpent: number;
        lastBooked?: Date;
    }>;
    private buildFilterQuery;
    private buildSortQuery;
}
export {};
//# sourceMappingURL=AdminUserRepositoryImpl.d.ts.map