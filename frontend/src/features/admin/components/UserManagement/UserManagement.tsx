import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { TablePagination } from "@/shared/components/ui/Table";
import {
  fetchAdminUsers,
  updateUserStatus,
  setFilters,
  setPage,
  setLimit,
  clearError,
  resetFilters,
} from "@/features/admin/store/adminUsersSlice";
import type { RootState, AppDispatch } from "@/app/store";
import type {
  UserAction,
  UserFilters as UserFiltersType,
} from "./UserManagement.types";

// Debounce hook for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    loading,
    error,
    filters,
    page,
    limit,
    pagination,
    actionLoading,
  } = useSelector((state: RootState) => state.adminUsers);

  // Local state for immediate search input
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounced search value
  const debouncedSearch = useDebounce(localSearch, 300);

  // Effect to update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilters({ search: debouncedSearch }));
    }
  }, [debouncedSearch, filters.search, dispatch]);

  // Effect to fetch users when dependencies change
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch, filters, page, limit]);

  // Effect to sync local search with store when filters reset
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleFiltersChange = useCallback(
    (newFilters: UserFiltersType) => {
      // Handle search separately for immediate UI feedback
      if (newFilters.search !== undefined) {
        setLocalSearch(newFilters.search);
        // Don't dispatch search immediately, let debounce handle it
        const { search, ...otherFilters } = newFilters;
        if (Object.keys(otherFilters).length > 0) {
          dispatch(setFilters(otherFilters));
        }
      } else {
        dispatch(setFilters(newFilters));
      }
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const handleSizeChange = useCallback(
    (newSize: number) => {
      dispatch(setLimit(newSize));
    },
    [dispatch]
  );

  const handleUserAction = useCallback(
    async (userId: string, action: UserAction) => {
      try {
        await dispatch(updateUserStatus({ userId, action })).unwrap();
        dispatch(fetchAdminUsers());
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    setLocalSearch("");
    dispatch(resetFilters());
  }, [dispatch]);

  const isActionLoading = (userId: string) => {
    return actionLoading[userId] || false;
  };

  // Combine local search with other filters for display
  const displayFilters: UserFiltersType = {
    ...filters,
    search: localSearch,
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">{error}</div>
          </div>
          <button
            onClick={handleClearError}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      <UserFilters
        filters={displayFilters}
        onFiltersChange={handleFiltersChange}
      />

      <UserTable
        users={users}
        loading={loading}
        onUserClick={() => {}}
        onDeleteUser={() => {}}
        onUserAction={handleUserAction}
        isActionLoading={isActionLoading}
      />

      <TablePagination
        currentPage={page}
        totalPages={pagination.totalPages}
        pageSize={limit}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handleSizeChange}
      />
    </div>
  );
};
