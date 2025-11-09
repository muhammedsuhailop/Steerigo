import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDriverByIdQuery,
  useUpdateDriverStatusMutation,
} from "@/features/admin/shared/services/adminApi";
import type {
  DriverProfileAction,
  KYCVerificationStatus,
  AdminDriverProfileResponse,
} from "../../../shared/types/adminDriverProfile.types";

export const useDriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();

  const [updateDriverStatus, { isLoading: isUpdatingStatus }] =
    useUpdateDriverStatusMutation();

  const {
    data: driverProfileResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDriverByIdQuery(driverId!, {
    skip: !driverId,
  });

  const driverProfile = useMemo(() => {
    return driverProfileResponse?.data || null;
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

        console.log("Driver action successful:", result.message);
        await refetch();
        return { success: true, message: result.message };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update driver status";
        console.error("Driver action failed:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    [driverId, updateDriverStatus, refetch]
  );

  const refreshProfile = useCallback(() => {
    refetch();
  }, [refetch]);

  const getAvailableActions = useCallback(
    (
      status: "Pending Verification" | "Active" | "Suspended" | "Inactive"
    ): DriverProfileAction[] => {
      switch (status) {
        case "Pending Verification":
          return ["Active", "Suspended"];
        case "Active":
          return ["Suspended"];
        case "Suspended":
          return ["Active"];
        case "Inactive":
          return ["Active"];
        default:
          return [];
      }
    },
    []
  );

  const availableActions = useMemo(() => {
    if (!driverProfile?.driver?.status) return [];
    return getAvailableActions(driverProfile.driver.status);
  }, [driverProfile?.driver?.status, getAvailableActions]);

  return {
    driverProfile,
    isLoading,
    isFetching,
    isUpdating: isUpdatingStatus,
    error,
    handleDriverAction,
    refreshProfile,
    availableActions,
    driverId,
  };
};
