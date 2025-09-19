import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { TablePagination } from "@/shared/components/ui/Table";
import {
  fetchAdminUsers,
  setFilters,
  setPage,
  setLimit,
} from "@/features/admin/store/adminUsersSlice";
import type { RootState, AppDispatch } from "@/app/store";

export const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, filters, page, limit, pagination } =
    useSelector((state: RootState) => state.adminUsers);

  // fetch on mount and when dependencies change
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch, filters, page, limit]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters));
  };
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };
  const handleSizeChange = (newSize: number) => {
    dispatch(setLimit(newSize));
  };

  return (
    <div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onAddUser={() => {}}
        onExport={() => {}}
      />
      <UserTable
        users={users}
        loading={loading}
        onUserClick={() => {}}
        onDeleteUser={() => {}}
        onToggleStatus={() => {}}
      />
      <TablePagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.pageSize}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        showSizeChanger
      />
    </div>
  );
};
