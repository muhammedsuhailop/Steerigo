export interface UserFilters {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface UserWithStats {
  userId: string;
  name: string;
  email: string;
  status: string;
  totalBookings: number;
  totalSpent: number;
  lastBooked?: string;
  joinedDate?: Date;
  isVerified?: boolean;
}

export interface IAdminUserRepository {
  findUsersOnly(
    filters: UserFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<UserWithStats>>;

  updateUserStatus(
    userId: string,
    status: string,
    reason?: string
  ): Promise<void>;

  getUserStats(userId: string): Promise<UserWithStats>;
}
