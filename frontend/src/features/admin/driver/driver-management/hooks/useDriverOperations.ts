import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setFilters,
  setPage,
  setLimit,
  resetFilters,
} from "@/features/admin/shared/store/adminDriverSlice";
import {
  useGetAllDriversQuery,
  useUpdateDriverStatusMutation,
} from "@/features/admin/shared/services/adminApi";
import type { AppDispatch } from "@/app/store";

export type DriverAction =
  | "activate"
  | "suspend"
  | "deactivate"
  | "block"
  | "approve"
  | "reject";

interface DriverFilters {
  search: string;
  status: string;
  kycStatus: string;
  vehicleType: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export const useDriverOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [updateDriverStatus, { isLoading: isUpdating }] =
    useUpdateDriverStatusMutation();

  const handleFiltersChange = useCallback(
    (filters: Partial<DriverFilters>) => {
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

  const handleDriverAction = useCallback(
    async (driverId: string, action: DriverAction, reason?: string) => {
      try {
        const result = await updateDriverStatus({
          driverId,
          action,
          reason,
        }).unwrap();

        console.log("Driver action successful:", result.message);
        return { success: true, message: result.message };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update driver status";
        console.error("Driver action failed:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateDriverStatus]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleDriverAction,
    handleResetFilters,
    isUpdating,
  };
};

export const useDriversData = (
  filters: DriverFilters,
  page: number,
  limit: number
) => {
  return useGetAllDriversQuery({
    page,
    limit,
    status: filters.status,
    kycStatus: filters.kycStatus,
    search: filters.search,
    vehicleType: filters.vehicleType,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
};
