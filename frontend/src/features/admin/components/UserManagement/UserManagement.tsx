import React, { useEffect } from "react";
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
} from "@/features/admin/store/adminUsersSlice";
import type { RootState, AppDispatch } from "@/app/store";
import type { UserAction } from "./UserManagement.types";

export const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, filters, page, limit, pagination } =
    useSelector((state: RootState) => state.adminUsers);

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

  const handleUserAction = async (userId: string, action: UserAction) => {
    try {
      await dispatch(updateUserStatus({ userId, action })).unwrap();
      dispatch(fetchAdminUsers());
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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
        onUserAction={handleUserAction}
      />

      <TablePagination
        currentPage={page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handleSizeChange}
        itemsPerPage={limit}
      />
    </div>
  );
};
