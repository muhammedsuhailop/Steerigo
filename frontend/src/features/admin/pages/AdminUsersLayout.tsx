import React, { useEffect, useCallback } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { useAdminOperations } from '../hooks/useAdminOperations';
import { AdminUserTable } from '../components/AdminUserTable';
import { AdminUserFilters } from '../components/AdminUserFilters';
import { AdminUserFilters as FilterType } from '../types/admin.types';

const AdminUsersLayout: React.FC = () => {
  const {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalUsers,
    searchQuery,
    roleFilter,
    statusFilter,
  } = useAppSelector(state => state.adminUsers);

  const {
    fetchUsers,
    updateUser,
    deleteUser,
    updateFilters,
  } = useAdminOperations();

  // Create filters object from Redux state
  const filters: FilterType = {
    search: searchQuery,
    role: roleFilter,
    status: statusFilter,
    page: currentPage,
    limit: 10,
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers(filters);
  }, [searchQuery, roleFilter, statusFilter, currentPage]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Partial<FilterType>) => {
    updateFilters(newFilters);
    // Reset to page 1 when filters change (except for page change)
    if (!newFilters.page) {
      updateFilters({ page: 1 });
    }
  }, [updateFilters]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    updateFilters({
      search: '',
      role: '',
      status: '',
      page: 1,
    });
  }, [updateFilters]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  // Handle user update
  const handleUserUpdate = useCallback(async (user: any) => {
    try {
      await updateUser({
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
      });
      // Refresh the current page
      fetchUsers(filters);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }, [updateUser, fetchUsers, filters]);

  // Handle user delete
  const handleUserDelete = useCallback(async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const success = await deleteUser(userId, user.name);
      if (success) {
        // Refresh the current page
        fetchUsers(filters);
      }
    }
  }, [deleteUser, users, fetchUsers, filters]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all users in your system ({totalUsers} total)
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <AdminUserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Users Table */}
      <AdminUserTable
        users={users}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
      />
    </div>
  );
};

export default AdminUsersLayout;
