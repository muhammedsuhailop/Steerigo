import { AppDispatch } from "@/app/store";
import { AdminStateService } from "../../user-management/types/userManagement.types";
import {
  setFilters,
  setPage,
  setLimit,
  clearActionLoading,
  resetFilters,
} from "../store/adminUsersSlice";
import type { UserFilters } from "../../user-management/components/UserManagement/UserManagement.types";

export class ReduxAdminStateService implements AdminStateService {
  constructor(private dispatch: AppDispatch) {}

  setFilters(filters: Partial<UserFilters>): void {
    this.dispatch(setFilters(filters));
  }

  setPage(page: number): void {
    this.dispatch(setPage(page));
  }

  setLimit(limit: number): void {
    this.dispatch(setLimit(limit));
  }

  clearActionLoading(userId: string): void {
    this.dispatch(clearActionLoading(userId));
  }

  resetFilters(): void {
    this.dispatch(resetFilters());
  }
}
