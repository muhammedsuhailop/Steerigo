import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDriverById,
  updateDriverStatus,
  clearSelectedDriver,
  clearError,
} from '@/features/admin/shared/store/adminDriverSlice';
import type { AppDispatch, RootState } from '@/app/store';
import type { DriverAction } from '@/features/admin/shared/types';

export const useDriverProfile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedDriver: driver,
    loading,
    error,
    actionLoading,
  } = useSelector((state: RootState) => state.adminDrivers);

  // Fetch driver on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchDriverById(id));
    }
    return () => {
      dispatch(clearSelectedDriver());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  // Update driver status (approve/reject/etc)
  const handleDriverAction = useCallback(
    async (action: DriverAction, reason?: string) => {
      if (!id) return false;
      try {
        const result = await dispatch(
          updateDriverStatus({ driverId: id, action, reason })
        ).unwrap();
        // Refresh profile
        dispatch(fetchDriverById(id));
        return { success: true, message: result.message };
      } catch (err: any) {
        return { success: false, message: err.message || 'Action failed' };
      }
    },
    [dispatch, id]
  );

  // Check if a given action is loading
  const isActionLoading = useCallback(
    (actionDriverId?: string) => {
      const key = actionDriverId || id;
      return key ? Boolean(actionLoading[key]) : false;
    },
    [actionLoading, id]
  );

  // Retry fetch on error
  const retryFetch = useCallback(() => {
    if (id) {
      dispatch(clearError());
      dispatch(fetchDriverById(id));
    }
  }, [dispatch, id]);

  return {
    driver,
    loading,
    error,
    handleDriverAction,
    isActionLoading,
    retryFetch,
  };
};

export default useDriverProfile;
