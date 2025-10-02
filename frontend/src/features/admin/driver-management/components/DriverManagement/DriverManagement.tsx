import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DriverFilters } from "../DriverFilters/DriverFilters";
import { DriverTable } from "../DriverTable/DriverTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { fetchAdminDrivers } from "@/features/admin/shared/store/adminDriverSlice";
import { useDriverOperations } from "../../hooks/useDriverOperations";
import type { RootState, AppDispatch } from "@/app/store";
import type { DriverFilters as DriverFiltersType } from "../../../shared/types";

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

export const DriverManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { drivers, loading, filters, page, limit, pagination, actionLoading } =
    useSelector((state: RootState) => state.adminDrivers);

  const {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleDriverAction,
    handleResetFilters,
    clearActionLoading,
  } = useDriverOperations();

  // local search state and debounce logic
  const [localSearch, setLocalSearch] = useState<string>(filters.search ?? "");
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFiltersChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, handleFiltersChange]);

  useEffect(() => {
    dispatch(fetchAdminDrivers());
  }, [dispatch, filters, page, limit]);

  useEffect(() => {
    setLocalSearch(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      handlePageChange(pagination.totalPages);
    } else if (pagination.totalPages === 0 && page !== 1) {
      handlePageChange(1);
    }
  }, [pagination.totalPages, page, handlePageChange]);

  const onFiltersChange = useCallback(
    (newFilters: Partial<DriverFiltersType>) => {
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

  const isActionLoading = (driverId: string) => {
    return actionLoading[driverId] || false;
  };

  const displayFilters: DriverFiltersType = {
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
      <DriverFilters
        filters={displayFilters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
        loading={loading}
      />

      <DriverTable
        drivers={drivers}
        loading={loading}
        onDriverAction={handleDriverAction}
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
