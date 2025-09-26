// Based on your existing admin user data structure
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: "Rider" | "Driver" | "Admin";
  status?: "Active" | "Inactive" | "Pending" | "Suspended";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profileImage?: string;
}

// Match your existing Redux state structure
export interface AdminUsersState {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
}

// API Response types matching your backend
export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
}

export interface AdminUserUpdatePayload {
  id: string;
  name?: string;
  email?: string;
  role?: AdminUser['role'];
  status?: AdminUser['status'];
  isVerified?: boolean;
}

// Filter types for existing functionality
export interface AdminUserFilters {
  search: string;
  role: string;
  status: string;
  page: number;
  limit: number;
}
