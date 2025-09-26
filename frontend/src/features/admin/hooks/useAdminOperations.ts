import { useCallback } from 'react';
import { useAdminServices } from './useAdminServices';
import { AdminUser, AdminUserFilters, AdminUserUpdatePayload } from '../types/admin.types';

export const useAdminOperations = () => {
  const services = useAdminServices();

  const fetchUsers = useCallback(async (filters: AdminUserFilters) => {
    try {
      services.stateService.setLoading(true);
      services.stateService.clearError();
      
      const response = await services.dataService.fetchUsers(filters);
      
      if (response.success) {
        services.stateService.setUsers(
          response.data.users,
          response.data.totalCount,
          response.data.currentPage,
          response.data.totalPages
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      services.stateService.setError(errorMessage);
      services.notificationService.showError(errorMessage);
    } finally {
      services.stateService.setLoading(false);
    }
  }, [services]);

  const updateUser = useCallback(async (payload: AdminUserUpdatePayload) => {
    try {
      services.stateService.setLoading(true);
      services.stateService.clearError();
      
      const updatedUser = await services.dataService.updateUser(payload);
      services.notificationService.showSuccess('User updated successfully');
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      services.stateService.setError(errorMessage);
      services.notificationService.showError(errorMessage);
      throw error;
    } finally {
      services.stateService.setLoading(false);
    }
  }, [services]);

  const deleteUser = useCallback(async (userId: string, userName: string) => {
    try {
      const confirmed = await services.notificationService.showConfirmation(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      );
      
      if (!confirmed) return false;

      services.stateService.setLoading(true);
      services.stateService.clearError();
      
      await services.dataService.deleteUser(userId);
      services.notificationService.showSuccess('User deleted successfully');
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      services.stateService.setError(errorMessage);
      services.notificationService.showError(errorMessage);
      return false;
    } finally {
      services.stateService.setLoading(false);
    }
  }, [services]);

  const updateFilters = useCallback((filters: Partial<AdminUserFilters>) => {
    services.stateService.setFilters(filters);
  }, [services]);

  return {
    fetchUsers,
    updateUser,
    deleteUser,
    updateFilters,
  };
};
