import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setFilters,
  setPage,
  setLimit,
  resetFilters,
} from "@/features/admin/shared/store/adminUsersSlice";
import { useUpdateUserStatusMutation } from "@/features/admin/shared/services/adminApi";
import type { AppDispatch } from "@/app/store/store";
import type {
  UserAction,
  UserFilters,
} from "../components/UserManagement/UserManagement.types";

export const useAdminOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const handleFiltersChange = useCallback(
    (filters: Partial<UserFilters>) => {
      dispatch(setFilters(filters));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setPage(page));
    },
    [dispatch]
  );

  const handleSizeChange = useCallback(
    (limit: number) => {
      dispatch(setLimit(limit));
    },
    [dispatch]
  );

  const handleUserAction = useCallback(
    async (userId: string, action: UserAction) => {
      try {
        const result = await updateUserStatus({ userId, action }).unwrap();
        console.log("User action successful:", result.message);
        return { success: true, message: result.message };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update user status";
        console.error("User action failed:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateUserStatus]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleUserAction,
    handleResetFilters,
    isUpdating,
  };
};
