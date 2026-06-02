import { User } from "@domain/entities/User";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";
export interface IAdminUsersQuery {
    status?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export interface IAdminUserSummary {
    userId: string;
    name: string;
    email: string;
    mobile: string;
    status: string;
    isVerified: boolean;
    totalBookings: number;
    totalSpent: number;
    lastBooked?: Date;
    createdAt: Date;
}
export interface IAdminUserRepository extends IReadOnlyRepository<User>, IQueryableRepository<User> {
    findUsersWithSummary(filters: IAdminUsersQuery, pagination: {
        page: number;
        pageSize: number;
    }): Promise<{
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
}
//# sourceMappingURL=IAdminUserRepository.d.ts.map