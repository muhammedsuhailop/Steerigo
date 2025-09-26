import type {
  User,
  UserFilters,
  UserAction,
} from "../components/UserManagement/UserManagement.types";

// Data Service Interface
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

// State Service Interface
export interface AdminStateService {
  setFilters(filters: Partial<UserFilters>): void;
  setPage(page: number): void;
  setLimit(limit: number): void;
  clearActionLoading(userId: string): void;
  resetFilters(): void;
}

// Notification Service Interface
export interface AdminNotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showInfo(message: string): void;
}

// Analytics Service Interface
export interface AdminAnalyticsService {
  trackUserAction(
    action: string,
    userId: string,
    metadata?: Record<string, any>
  ): void;
  trackPageView(page: string): void;
  trackError(error: Error, context?: string): void;
}

// Stats Service Interface
export interface AdminStatsService {
  calculateStats(
    users: User[],
    pagination?: any
  ): {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
    blockedUsers: number;
    recentUsers: User[];
    systemHealth: {
      serverStatus: "online" | "offline" | "maintenance";
      databaseStatus: "connected" | "disconnected" | "slow";
      paymentGateway: "active" | "inactive" | "error";
    };
  };
}
