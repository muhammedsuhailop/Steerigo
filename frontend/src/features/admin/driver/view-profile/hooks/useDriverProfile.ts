import { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDriverById,
  updateDriverStatus,
  clearSelectedDriver,
  clearError,
  clearActionMessage,
} from "@/features/admin/shared/store/adminDriverSlice";
import type { AppDispatch, RootState } from "@/app/store";
import type { DriverAction } from "@/features/admin/shared/types";

export const useDriverProfile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedDriver: driver,
    loading,
    error,
    actionLoading,
    actionMessage,
    actionMessageType,
  } = useSelector((s: RootState) => s.adminDrivers);

  useEffect(() => {
    if (id) dispatch(fetchDriverById(id));
    return () => {
      dispatch(clearSelectedDriver());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  const handleDriverAction = useCallback(
    async (action: DriverAction, reason?: string) => {
      if (!id) return;
      try {
        await dispatch(
          updateDriverStatus({ driverId: id, action, reason })
        ).unwrap();
        dispatch(fetchDriverById(id));
      } catch {
        // error handle by slice
      }
    },
    [dispatch, id]
  );

  const clearMessage = useCallback(() => {
    dispatch(clearActionMessage());
  }, [dispatch]);

  const isActionLoading = useCallback(
    (did?: string) => Boolean(actionLoading[did || id!]),
    [actionLoading, id]
  );

  const kycItems = (
    driver?.kycDocs
      ? driver.kycDocs.map((doc) => ({
          id: doc.id,
          driverId: doc.driverId,
          documentType: doc.documentType,
          documentNumber: doc.documentNumber,
          issueDate: doc.issueDate,
          expiryDate: doc.expiryDate,
          urlFront: doc.documentImageUrls[0] || "",
          urlBack: doc.documentImageUrls[1] || "",
          isVerified: doc.isVerified,
          comments: doc.comments,
          submittedAt: doc.submittedAt,
        }))
      : []
  ) as any[];

  return {
    driver,
    kycItems,
    loading,
    error,
    actionMessage,
    actionMessageType,
    clearMessage,
    handleDriverAction,
    isActionLoading,
  };
};
