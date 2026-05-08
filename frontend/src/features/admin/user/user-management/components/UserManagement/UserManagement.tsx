import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { useGetAllUsersQuery } from "@/features/admin/shared/services/adminApi";
import { useAdminOperations } from "../../hooks/useAdminOperations";
import {
  selectFilters,
  selectPage,
  selectLimit,
} from "@/features/admin/shared/store/adminUsersSlice";
import type { UserFilters as UserFiltersType } from "./UserManagement.types";

//  Debounce hook for search input
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Main User Management Component
export const UserManagement: React.FC = () => {
  // Get local state from Redux
  const filters = useSelector(selectFilters);
  const page = useSelector(selectPage);
  const limit = useSelector(selectLimit);

  // Get operations from custom hook
  const {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleUserAction,
    handleResetFilters,
    isUpdating,
  } = useAdminOperations();

  // Local search state with debounce
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Fetch users with RTK Query
  const {
    data: usersData,
    isLoading,
    isFetching,
    error,
  } = useGetAllUsersQuery({
    page,
    limit,
    status: filters.status,
    search: debouncedSearch,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

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
    (newFilters: UserFiltersType) => {
      if (newFilters.search !== undefined) {
        setLocalSearch(newFilters.search);
        // Apply other filters immediately
        const { search:_search, ...otherFilters } = newFilters;
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
      const totalPages = usersData?.data.pagination.totalPages || 1;
      const safePage = Math.max(1, Math.min(newPage, totalPages));
      if (safePage !== page) {
        handlePageChange(safePage);
      }
    },
    [handlePageChange, page, usersData]
  );

  // Handle page size changes
  const onSizeChange = useCallback(
    (newSize: number) => {
      const safeSize = Math.max(1, Math.min(newSize, 100));
      handleSizeChange(safeSize);
    },
    [handleSizeChange]
  );

  // Check if specific user action is loading
  const isActionLoading = useCallback(
    (_userId: string) => isUpdating,
    [isUpdating]
  );

  // Display filters (with local search)
  const displayFilters: UserFiltersType = { ...filters, search: localSearch };

  // Safe pagination data
  const pagination = {
    currentPage: usersData?.data.pagination.page || page,
    totalPages: usersData?.data.pagination.totalPages || 1,
    totalItems: usersData?.data.pagination.totalItems || 0,
    pageSize: usersData?.data.pagination.pageSize || limit,
  };

  // Users data
  const users = usersData?.data.users || [];

  return (
    <>
      {/* Filters */}
      <UserFilters
        filters={displayFilters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
        loading={isLoading || isFetching}
      />

      {/* Error Display */}
      {error && <div>Failed to load users. Please try again.</div>}

      {/* Users Table */}
      <UserTable
        users={users}
        loading={isLoading || isFetching}
        onUserClick={() => {}}
        onDeleteUser={() => {}}
        onUserAction={handleUserAction}
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
  );
};
