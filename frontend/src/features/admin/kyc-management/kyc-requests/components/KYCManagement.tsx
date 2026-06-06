import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { KYCFilters } from "../components/KYCFilters/KYCFilters";
import { KYCRequestsTable } from "../components/KYCRequestsTable/KYCRequestsTable";
import { TablePagination } from "@/shared/components/ui/Table";
import {
  useKYCOperations,
  useKYCRequestsData,
} from "../hooks/useKYCOperations";
import {
  selectFilters,
  selectPage,
  selectLimit,
} from "@/features/admin/shared/store/adminKYCSlice";
import type { KYCAction, KYCRequest } from "@/features/admin/shared/types/kyc.interfaces";
import type { KYCFiltersType } from "./KYCManagement.types";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

// Debounce hook for search input

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const KYCManagement: React.FC = () => {
  // Get local state from Redux
  const filters = useSelector(selectFilters) as KYCFiltersType;
  const page = useSelector(selectPage);
  const limit = useSelector(selectLimit);

  // Get operations from custom hook
  const {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleKYCAction,
    handleResetFilters,
  } = useKYCOperations();

  // Local search state with debounce
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Local state for action loading per KYC ID
  const [loadingKYCIds, setLoadingKYCIds] = useState<Set<string>>(new Set());

  // Fetch KYC requests with RTK Query
  const {
    data: kycData,
    isLoading,
    isFetching,
    error,
  } = useKYCRequestsData(
    {
      ...filters,
      search: debouncedSearch,
    },
    page,
    limit
  );

  // Sync debounced search with filters
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFiltersChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, handleFiltersChange]);

  // Sync local search with filters when filters reset
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Handle filter changes
  const onFiltersChange = useCallback(
    (newFilters: Partial<KYCFiltersType>) => {
      if (newFilters.search !== undefined) {
        setLocalSearch(newFilters.search);
        // Apply other filters immediately
        const { search: _search, ...otherFilters } = newFilters;
        if (Object.keys(otherFilters).length > 0) {
          handleFiltersChange(otherFilters);
        }
      } else {
        handleFiltersChange(newFilters);
      }
    },
    [handleFiltersChange]
  );

  // Handle page changes with validation
  const onPageChange = useCallback(
    (newPage: number) => {
      const totalPages = kycData?.data?.pagination?.totalPages || 1;
      const safePage = Math.max(1, Math.min(newPage, totalPages));

      if (safePage !== page) {
        handlePageChange(safePage);
      }
    },
    [handlePageChange, page, kycData]
  );

  // Handle page size changes
  const onSizeChange = useCallback(
    (newSize: number) => {
      const safeSize = Math.max(1, Math.min(newSize, 100));
      handleSizeChange(safeSize);
    },
    [handleSizeChange]
  );

  // Check if specific KYC action is loading
  const isActionLoading = useCallback(
    (kycId: string) => {
      return loadingKYCIds.has(kycId);
    },
    [loadingKYCIds]
  );

  // Handle KYC action with optional reason
  const handleKYCActionWithReason = useCallback(
    async (kycId: string, action: KYCAction, reason?: string) => {
      setLoadingKYCIds((prev) => new Set(prev).add(kycId));
      try {
        await handleKYCAction(kycId, action, reason);
        console.log(`KYC ${action}d successfully`);
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Failed KYC action");
        console.error(`Failed to ${action} KYC:`, msg);
      } finally {
        setLoadingKYCIds((prev) => {
          const next = new Set(prev);
          next.delete(kycId);
          return next;
        });
      }
    },
    [handleKYCAction]
  );

  // Display filters (with local search)
  const displayFilters: KYCFiltersType = { ...filters, search: localSearch };

  // Safe pagination data
  const pagination = {
    currentPage: kycData?.data?.pagination?.currentPage ?? page,
    totalPages: kycData?.data?.pagination?.totalPages ?? 1,
    totalItems: kycData?.data?.pagination?.totalItems ?? 0,
    pageSize: kycData?.data?.pagination?.pageSize ?? limit,
  };

  // KYC requests data - Extract from nested structure
  const kycRequests: KYCRequest[] = kycData?.data?.kycDocuments || [];

  return (
    <>
      {/* Filters */}
      <KYCFilters
        filters={displayFilters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
        loading={isLoading || isFetching}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Failed to load KYC requests</p>
          <p className="text-sm mt-1">Please try again or contact support.</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Loading KYC requests...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && kycRequests.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-6 rounded-lg text-center mb-6">
          <p className="font-medium">No KYC requests found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}

      {/* KYC Requests Table */}
      {kycRequests.length > 0 && (
        <>
          <KYCRequestsTable
            requests={kycRequests}
            loading={isLoading || isFetching}
            onKYCAction={handleKYCActionWithReason}
            isActionLoading={isActionLoading}
          />

          {/* Pagination */}
          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onSizeChange}
          />
        </>
      )}
    </>
  );
};

export default KYCManagement;
