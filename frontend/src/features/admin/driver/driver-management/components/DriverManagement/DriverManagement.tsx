import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { DriverFilters } from "../DriverFilters/DriverFilters";
import { DriverTable } from "../DriverTable/DriverTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { useGetAllDriversQuery } from "@/features/admin/shared/services/adminApi";
import { useDriverOperations } from "../../hooks/useDriverOperations";
import {
  selectFilters,
  selectPage,
  selectLimit,
} from "@/features/admin/shared/store/adminDriverSlice";
import type { DriverFilters as DriverFiltersType } from "../../../../shared/types";
import type { AdminDriver } from "@/features/admin/shared/services/adminApi";

// Debounce hook for search input
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Main Driver Management Component
export const DriverManagement: React.FC = () => {
  // Get local state from Redux
  const filters = useSelector(selectFilters);
  const page = useSelector(selectPage);
  const limit = useSelector(selectLimit);

  // Get operations from custom hook
  const {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleDriverAction,
    handleResetFilters,
    isUpdating,
  } = useDriverOperations();

  // Local search state with debounce
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const debouncedSearch = useDebounce(localSearch, 300);

  // Fetch drivers with RTK Query
  const {
    data: driversData,
    isLoading,
    isFetching,
    error,
  } = useGetAllDriversQuery({
    page,
    limit,
    status: filters.status,
    kycStatus: filters.kycStatus,
    search: debouncedSearch,
    vehicleType: filters.vehicleType,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  // Safe pagination data - MOVE THIS BEFORE THE useEffect THAT USES IT
  const pagination = {
    currentPage: Math.max(1, driversData?.data.pagination.page || page),
    totalPages: Math.max(0, driversData?.data.pagination.totalPages || 1),
    totalItems: Math.max(0, driversData?.data.pagination.totalItems || 0),
    pageSize: Math.max(1, driversData?.data.pagination.pageSize || limit),
  };

  // Sync debounced search with filters
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFiltersChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, handleFiltersChange]);

  // Sync local search with filters when filters reset
  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  // Validate page when pagination changes
  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      handlePageChange(pagination.totalPages);
    } else if (pagination.totalPages === 0 && page !== 1) {
      handlePageChange(1);
    }
  }, [pagination.totalPages, page, handlePageChange]);

  // Handle filter changes
  const onFiltersChange = useCallback(
    (newFilters: Partial<DriverFiltersType>) => {
      if (newFilters.search !== undefined) {
        setLocalSearch(newFilters.search);
        // Apply other filters immediately
        const { search, ...otherFilters } = newFilters;
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
      const totalPages = pagination.totalPages || 1;
      const safePage = Math.max(1, Math.min(newPage, totalPages));
      if (
        safePage !== page &&
        safePage >= 1 &&
        (pagination.totalPages === 0 || safePage <= pagination.totalPages)
      ) {
        handlePageChange(safePage);
      }
    },
    [handlePageChange, page, pagination.totalPages]
  );

  // Handle page size changes
  const onSizeChange = useCallback(
    (newSize: number) => {
      const safeSize = Math.max(1, Math.min(newSize, 100));
      handleSizeChange(safeSize);
    },
    [handleSizeChange]
  );

  // Check if specific driver action is loading
  const isActionLoading = useCallback(
    (driverId: string) => isUpdating,
    [isUpdating]
  );

  // Display filters (with local search)
  const displayFilters: DriverFiltersType = { ...filters, search: localSearch };

  // Drivers data (use API response directly)
  const drivers: AdminDriver[] = driversData?.data.drivers || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <DriverFilters
        filters={displayFilters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
        loading={isLoading || isFetching}
      />

      {/* Drivers Table */}
      <DriverTable
        drivers={drivers}
        loading={isLoading || isFetching}
        onDriverAction={handleDriverAction}
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
    </div>
  );
};
