import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { fetchAdminUsers } from "@/features/admin/store/adminUsersSlice";
import { useAdminOperations } from "../../hooks/useAdminOperations";
import type { RootState, AppDispatch } from "@/app/store";
import type { UserFilters as UserFiltersType } from "./UserManagement.types";

// debounce hook
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

  const {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleUserAction,
    handleResetFilters,
    clearActionLoading,
  } = useAdminOperations();

  // local search state and debounce logic
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFiltersChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, handleFiltersChange]);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch, filters, page, limit]);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      handlePageChange(pagination.totalPages);
    } else if (pagination.totalPages === 0 && page !== 1) {
      handlePageChange(1);
    }
  }, [pagination.totalPages, page, handlePageChange]);

  const onFiltersChange = useCallback(
    (newFilters: UserFiltersType) => {
      if (newFilters.search !== undefined) {
        setLocalSearch(newFilters.search);
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

  const onPageChange = useCallback(
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
        handlePageChange(safePage);
      }
    },
    [handlePageChange, page, pagination.totalPages]
  );

  const onSizeChange = useCallback(
    (newSize: number) => {
      const safeSize = Math.max(1, Math.min(newSize, 100));
      handleSizeChange(safeSize);
    },
    [handleSizeChange]
  );

  const isActionLoading = (userId: string) => {
    return actionLoading[userId] || false;
  };

  // Combine local search with other filters for display
  const displayFilters: UserFiltersType = {
    ...filters,
    search: localSearch,
  };

  const safePagination = {
    currentPage: Math.max(1, page),
    totalPages: Math.max(0, pagination.totalPages),
    totalItems: Math.max(0, pagination.totalItems),
    pageSize: Math.max(1, limit),
  };

  return (
    <div className="space-y-6">
      <UserFilters
        filters={displayFilters}
        onFiltersChange={onFiltersChange}
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
        onPageChange={onPageChange}
        onPageSizeChange={onSizeChange}
      />
    </div>
  );
};
