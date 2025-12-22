import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDriverByIdQuery,
  useUpdateDriverStatusMutation,
  useUpdateDriverKYCStatusMutation,
} from "@/features/admin/shared/services/adminApi";
import type {
  DriverProfileAction,
  AdminDriverProfileResponse,
} from "../../../shared/types/adminDriverProfile.types";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

export const useDriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();

  const [updateDriverStatus, { isLoading: isUpdatingStatus }] =
    useUpdateDriverStatusMutation();

  const [updateKYCStatus, { isLoading: isUpdatingKYCStatus }] =
    useUpdateDriverKYCStatusMutation();

  const {
    data: driverProfileResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDriverByIdQuery(driverId!, {
    skip: !driverId,
  });

  const driverProfile = useMemo<
    AdminDriverProfileResponse["data"] | null
  >(() => {
    return driverProfileResponse?.data ?? null;
  }, [driverProfileResponse]);

  const handleDriverAction = useCallback(
    async (action: DriverProfileAction, reason?: string) => {
      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      try {
        const result = await updateDriverStatus({
          driverId,
          action,
          reason,
        }).unwrap();
        await refetch();
        return { success: true, message: result.message };
      } catch (error: unknown) {
        throw new Error(
          getErrorMessage(error, "Failed to update driver status")
        );
      }
    },
    [driverId, updateDriverStatus, refetch]
  );

  const handleKYCStatusUpdate = useCallback(
    async (kycStatus: "Approved" | "InReview" | "Rejected" | "InReview") => {
      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      try {
        const result = await updateKYCStatus({
          driverId,
          kycStatus,
        }).unwrap();
        await refetch();
        return {
          success: true,
          message: result.message || "KYC status updated successfully",
        };
      } catch (error: unknown) {
        throw new Error(
          getErrorMessage(error, "Failed to update driver status")
        );
      }
    },
    [driverId, updateKYCStatus, refetch]
  );

  const refreshProfile = useCallback(() => {
    refetch();
  }, [refetch]);

  const getAvailableActions = useCallback(
    (status?: string): DriverProfileAction[] => {
      if (!status) return [];
      switch (status) {
        case "Pending Verification":
          return ["activate"];
        case "Active":
          return ["suspend", "block"];
        case "Suspended":
          return ["activate", "block"];
        case "Blocked":
          return ["activate"];
        default:
          return [];
      }
    },
    []
  );

  const availableActions = useMemo(() => {
    const drv = driverProfile?.driver;
    if (!drv || !drv.status) return [];
    return getAvailableActions(drv.status);
  }, [driverProfile, getAvailableActions]);

  return {
    driverProfile,
    isLoading,
    isFetching,
    isUpdating: isUpdatingStatus,
    isUpdatingKYC: isUpdatingKYCStatus,
    error,
    handleDriverAction,
    handleKYCStatusUpdate,
    refreshProfile,
    availableActions,
    driverId,
  };
};


