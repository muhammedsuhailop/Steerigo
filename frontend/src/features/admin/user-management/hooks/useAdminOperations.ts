import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AdminServiceContainer } from "../../shared/services";
import {
  fetchAdminUsers,
  updateUserStatus,
} from "../../shared/store/adminUsersSlice";
import type { AppDispatch } from "@/app/store";
import type {
  UserAction,
  UserFilters,
} from "../components/UserManagement/UserManagement.types";

export const useAdminOperations = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Initialize services
  const container = AdminServiceContainer.getInstance();
  try {
    container.getServices();
  } catch {
    container.initialize(dispatch);
  }
  const services = container.getServices();

  const handleFiltersChange = useCallback(
    (filters: Partial<UserFilters>) => {
      services.stateService.setFilters(filters);
    },
    [services.stateService]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      services.stateService.setPage(page);
    },
    [services.stateService]
  );

  const handleSizeChange = useCallback(
    (limit: number) => {
      services.stateService.setLimit(limit);
    },
    [services.stateService]
  );

  const handleUserAction = useCallback(
    async (userId: string, action: UserAction) => {
      try {
        const result = await dispatch(
          updateUserStatus({ userId, action })
        ).unwrap();
        services.notificationService.showSuccess(result.message);
        // Refresh data
        dispatch(fetchAdminUsers());
      } catch (error: any) {
        const errorMessage = error.message || "Failed to update user status";
        services.notificationService.showError(errorMessage);
        console.error("User action failed:", error);
      }
    },
    [dispatch, services.notificationService]
  );

  const handleResetFilters = useCallback(() => {
    services.stateService.resetFilters();
  }, [services.stateService]);

  const clearActionLoading = useCallback(
    (userId: string) => {
      services.stateService.clearActionLoading(userId);
    },
    [services.stateService]
  );

  return {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleUserAction,
    handleResetFilters,
    clearActionLoading,
  };
};
