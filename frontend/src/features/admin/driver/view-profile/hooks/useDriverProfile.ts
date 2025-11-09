import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDriverByIdQuery,
  useUpdateDriverStatusMutation,
} from "@/features/admin/shared/services/adminApi";
import type {
  DriverProfileAction,
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
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update driver status";
        throw new Error(errorMessage);
      }
    },
    [driverId, updateDriverStatus, refetch]
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

  const availableActions = useMemo<DriverProfileAction[]>(() => {
    const drv = driverProfile?.driver;
    if (!drv || !drv.status) return [];
    return getAvailableActions(drv.status);
  }, [driverProfile, getAvailableActions]);

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
