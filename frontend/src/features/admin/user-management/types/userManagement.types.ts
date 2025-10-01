import { UserFilters } from "../components/UserManagement";

export interface AdminStateService {
  setFilters(filters: Partial<UserFilters>): void;
  setPage(page: number): void;
  setLimit(limit: number): void;
  clearActionLoading(userId: string): void;
  resetFilters(): void;
}