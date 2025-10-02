import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchAdminDrivers,
  updateDriverStatus,
  setFilters,
  setPage,
  setLimit,
  resetFilters,
  clearActionLoading,
} from '@/features/admin/shared/store/adminDriverSlice';
import type { AppDispatch } from '@/app/store';
import type { DriverAction, DriverFilters } from '../../shared/types';

export const useDriverOperations = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleFiltersChange = useCallback(
    (filters: Partial<DriverFilters>) => {
      dispatch(setFilters(filters));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setPage(page));
    },
    [dispatch]
  );

  const handleSizeChange = useCallback(
    (limit: number) => {
      dispatch(setLimit(limit));
    },
    [dispatch]
  );

  const handleDriverAction = useCallback(
    async (driverId: string, action: DriverAction) => {
      try {
        const result = await dispatch(
          updateDriverStatus({ driverId, action })
        ).unwrap();
        
        // Show success notification (you can integrate your notification service here)
        console.log(result.message);
        
        // Refresh data
        dispatch(fetchAdminDrivers());
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to update driver status';
        console.error('Driver action failed:', error);
        // Show error notification
      }
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handleClearActionLoading = useCallback(
    (driverId: string) => {
      dispatch(clearActionLoading(driverId));
    },
    [dispatch]
  );

  return {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleDriverAction,
    handleResetFilters,
    clearActionLoading: handleClearActionLoading,
  };
};