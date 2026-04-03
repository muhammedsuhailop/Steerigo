import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setFilters,
  setPage,
  setLimit,
  resetFilters,
} from "@/features/admin/shared/store/adminDriverSlice";
import {
  DriverProfileAction,
  useGetAllDriversQuery,
  useUpdateDriverStatusMutation,
} from "@/features/admin/shared/services/adminApi";
import type { AppDispatch } from "@/app/store/store";

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
    async (driverId: string, action: DriverProfileAction, reason?: string) => {
      try {
        const result = await updateDriverStatus({
          driverId,
          action,
          reason,
        }).unwrap();

        console.log("Driver action successful:", result.message);
        return { success: true, message: result.message };
      } catch (error: unknown) {
        let errorMessage = "Failed to update driver status";

        if (typeof error === "object" && error !== null) {
          if (
            "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message ===
              "string"
          ) {
            errorMessage = (error as { data: { message: string } }).data
              .message;
          } else if (
            "message" in error &&
            typeof (error as { message?: string }).message === "string"
          ) {
            errorMessage = (error as { message: string }).message;
          }
        }

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
