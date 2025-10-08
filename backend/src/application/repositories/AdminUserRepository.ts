import { FilterOptions, QueryOptions } from "@shared/types/Repository";
import { User } from "@domain/entities/User";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";

export interface AdminUsersQuery {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminUserSummary {
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

export interface AdminUserRepository
  extends ReadOnlyRepository<User>,
    QueryableRepository<User> {
  findUsersWithSummary(
    filters: AdminUsersQuery,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: AdminUserSummary[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }>;

  updateUserStatus(
    userId: string,
    status: string,
    reason?: string
  ): Promise<boolean>;

  getUserStats(userId: string): Promise<{
    totalBookings: number;
    totalSpent: number;
    lastBooked?: Date;
  }>;
}
