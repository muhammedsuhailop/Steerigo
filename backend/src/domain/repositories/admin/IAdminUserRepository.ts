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
  getUserStats(userId: string): Promise<UserStats>;
}

export interface UserFilters {
  status?: "Active" | "Suspended" | "Pending Verification" | "Inactive";
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface UserWithStats {
  userId: string;
  name: string;
  email: string;
  status: string;
  totalBookings: number;
  totalSpent: number;
  lastBooked: string | null;
  joinedDate: Date;
  isVerified: boolean;
}

export interface UserStats {
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: Date | null;
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
