import { AppDispatch } from '@/app/store';
import { AdminStateService } from '../types/interfaces';
import { AdminUser, AdminUserFilters } from '../types/admin.types';

// Import your existing admin actions (we'll modify the slice next)
import { 
  setLoading, 
  setError, 
  setUsers, 
  setCurrentPage,
  setTotalPages,
  setTotalUsers,
  setSearchQuery,
  setRoleFilter,
  setStatusFilter,
  clearError 
} from '../store/adminUsersSlice';

export class ReduxAdminStateService implements AdminStateService {
  constructor(private dispatch: AppDispatch) {}

  setLoading(loading: boolean): void {
    this.dispatch(setLoading(loading));
  }

  setError(error: string | null): void {
    this.dispatch(setError(error));
  }

  setUsers(users: AdminUser[], totalCount: number, currentPage: number, totalPages: number): void {
    this.dispatch(setUsers(users));
    this.dispatch(setTotalUsers(totalCount));
    this.dispatch(setCurrentPage(currentPage));
    this.dispatch(setTotalPages(totalPages));
  }

  setFilters(filters: Partial<AdminUserFilters>): void {
    if (filters.search !== undefined) {
      this.dispatch(setSearchQuery(filters.search));
    }
    if (filters.role !== undefined) {
      this.dispatch(setRoleFilter(filters.role));
    }
    if (filters.status !== undefined) {
      this.dispatch(setStatusFilter(filters.status));
    }
  }

  clearError(): void {
    this.dispatch(clearError());
  }
}
