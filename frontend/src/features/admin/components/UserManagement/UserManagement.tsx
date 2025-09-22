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
  const { users, loading, filters, page, limit, pagination, actionLoading } =
    useSelector((state: RootState) => state.adminUsers);

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

  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      dispatch(setPage(pagination.totalPages));
    } else if (pagination.totalPages === 0 && page !== 1) {
      dispatch(setPage(1));
    }
  }, [pagination.totalPages, page, dispatch]);

  const handleFiltersChange = useCallback(
    (newFilters: UserFiltersType) => {
      if (newFilters.search !== undefined) {
        setLocalSearch(newFilters.search);
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
      const safePage = Math.max(
        1,
        Math.min(newPage, pagination.totalPages || 1)
      );

      if (
        safePage !== page &&
        safePage >= 1 &&
        (pagination.totalPages === 0 || safePage <= pagination.totalPages)
      ) {
        dispatch(setPage(safePage));
      }
    },
    [dispatch, page, pagination.totalPages]
  );

  const handleSizeChange = useCallback(
    (newSize: number) => {
      const safeSize = Math.max(1, Math.min(newSize, 100));
      dispatch(setLimit(safeSize));
    },
    [dispatch]
  );

  const handleUserAction = useCallback(
    async (userId: string, action: UserAction) => {
      try {
        const result = await dispatch(
          updateUserStatus({ userId, action })
        ).unwrap();

        console.log("User action completed:", result.message);

        dispatch(fetchAdminUsers());
      } catch (error) {
        console.error("User action failed:", error);
      }
    },
    [dispatch]
  );

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

  // Safe pagination values
  const safePagination = {
    currentPage: Math.max(1, page),
    totalPages: Math.max(0, pagination.totalPages),
    totalItems: Math.max(0, pagination.totalItems),
    pageSize: Math.max(1, limit),
  };

  return (
    <div className="space-y-6">
      {/* Clean component - no error handling UI needed */}
      <UserFilters
        filters={displayFilters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        loading={loading}
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
        currentPage={safePagination.currentPage}
        totalPages={safePagination.totalPages}
        totalItems={safePagination.totalItems}
        pageSize={safePagination.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handleSizeChange}
      />
    </div>
  );
};
