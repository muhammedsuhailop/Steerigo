import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setFilters,
  setPage,
  setLimit,
  resetFilters,
} from "@/features/admin/shared/store/adminKYCSlice";
import {
  useGetKYCRequestsQuery,
  useUpdateKYCStatusMutation,
  useGetKYCByIdQuery,
} from "@/features/admin/shared/services/adminApi";
import type { AppDispatch } from "@/app/store";

type KYCAction = "approve" | "reject";

interface KYCFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export const useKYCOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [updateKYCStatus, { isLoading: isUpdating }] =
    useUpdateKYCStatusMutation();

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
        const result = await updateKYCStatus({
          requestId,
          action,
          reason,
          status: action === "approve" ? "approved" : "rejected",
        }).unwrap();

        console.log("KYC action successful:", result.message);
        return { success: true, message: result.message };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update KYC status";
        console.error("KYC action failed:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateKYCStatus]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleKYCAction,
    handleResetFilters,
    isUpdating,
  };
};

export const useKYCRequestsData = (
  filters: KYCFilters,
  page: number,
  limit: number
) => {
  return useGetKYCRequestsQuery({
    page,
    limit,
    status: filters.status as "pending" | "approved" | "rejected" | undefined,
    search: filters.search,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
};

export const useKYCDetails = (requestId: string | undefined) => {
  const {
    data: kycData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetKYCByIdQuery(requestId!, {
    skip: !requestId,
  });

  const kycRequest = kycData?.data || null;

  const refreshKYC = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    kycRequest,
    isLoading,
    isFetching,
    error,
    refreshKYC,
  };
};
