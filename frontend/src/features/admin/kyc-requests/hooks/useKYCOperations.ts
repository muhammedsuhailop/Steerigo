import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  fetchKYCRequests,
  updateKYCStatus,
  setFilters,
  setPage,
  setLimit,
  resetFilters,
  clearActionLoading,
} from "@/features/admin/shared/store/adminKYCSlice";
import type { AppDispatch } from "@/app/store";
import type { KYCAction, KYCFilters } from "@/features/admin/shared/types";

export const useKYCOperations = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleFiltersChange = useCallback(
    (filters: Partial<KYCFilters>) => {
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

  const handleKYCAction = useCallback(
    async (requestId: string, action: KYCAction, reason?: string) => {
      try {
        const result = await dispatch(
          updateKYCStatus({ requestId, action, reason })
        ).unwrap();

        // Refresh the list after action
        dispatch(fetchKYCRequests());

        return { success: true, message: result.message };
      } catch (error: any) {
        const errorMessage = error.message || "Failed to update KYC status";
        return { success: false, message: errorMessage };
      }
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handleClearActionLoading = useCallback(
    (requestId: string) => {
      dispatch(clearActionLoading(requestId));
    },
    [dispatch]
  );

  return {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleKYCAction,
    handleResetFilters,
    clearActionLoading: handleClearActionLoading,
  };
};

export default useKYCOperations;
