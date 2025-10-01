import type {
  User,
  UserFilters,
  UserAction,
} from "../../user-management/components/UserManagement/UserManagement.types";
import { DashboardStats } from "../services/AdminStatsService";

export interface AdminDataService {
  fetchUsers(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    success: boolean;
    data: {
      users: User[];
      pagination: {
        totalItems: number;
        totalPages: number;
        page: number;
        pageSize: number;
      };
    };
  }>;
  updateUserStatus(
    userId: string,
    action: UserAction
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }>;
}

export interface AdminStateService {
  setFilters(filters: Partial<UserFilters>): void;
  setPage(page: number): void;
  setLimit(limit: number): void;
  clearActionLoading(userId: string): void;
  resetFilters(): void;
}

export interface AdminNotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showInfo(message: string): void;
}

export interface AdminStatsService {
  calculateStats(users: User[], pagination?: any): DashboardStats;
}
