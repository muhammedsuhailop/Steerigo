import { AdminUser, AdminUsersResponse, AdminUserUpdatePayload, AdminUserFilters } from './admin.types';

// Data Service Interface
export interface AdminDataService {
  fetchUsers(filters: AdminUserFilters): Promise<AdminUsersResponse>;
  updateUser(payload: AdminUserUpdatePayload): Promise<AdminUser>;
  deleteUser(userId: string): Promise<void>;
}

// State Service Interface
export interface AdminStateService {
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
  setUsers(users: AdminUser[], totalCount: number, currentPage: number, totalPages: number): void;
  setFilters(filters: Partial<AdminUserFilters>): void;
  clearError(): void;
}

// Navigation Service Interface
export interface AdminNavigationService {
  navigateToUsers(): void;
  navigateToDashboard(): void;
  refreshCurrentPage(): void;
}

// Notification Service Interface  
export interface AdminNotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showConfirmation(message: string): Promise<boolean>;
}
