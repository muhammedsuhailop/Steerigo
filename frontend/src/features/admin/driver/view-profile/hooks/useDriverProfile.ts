import { useCallback, useMemo } from "react";
import {
  useGetDriverByIdQuery,
  useUpdateDriverStatusMutation,
} from "@/features/admin/shared/services/adminApi";

type DriverProfileAction =
  | "activate"
  | "deactivate"
  | "suspend"
  | "block"
  | "approve"
  | "reject";

export const useDriverProfile = (driverId: string | undefined) => {
  const [updateDriverStatus, { isLoading: isUpdating }] =
    useUpdateDriverStatusMutation();

  const {
    data: driverData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDriverByIdQuery(driverId!, {
    skip: !driverId,
  });

  const driverProfile = useMemo(() => {
    return driverData?.data || null;
  }, [driverData]);

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

        console.log("✅ Driver profile action successful:", result.message);
        refetch();

        return { success: true, message: result.message };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update driver status";
        console.error("Driver profile action failed:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    [driverId, updateDriverStatus, refetch]
  );

  const refreshProfile = useCallback(() => {
    refetch();
  }, [refetch]);

  const getAvailableActions = useCallback(
    (status: string): DriverProfileAction[] => {
      switch (status?.toLowerCase()) {
        case "pending":
        case "in_review":
          return ["approve", "reject"];
        case "active":
          return ["suspend", "deactivate", "block"];
        case "inactive":
          return ["activate", "block"];
        case "suspended":
          return ["activate", "deactivate", "block"];
        case "blocked":
          return ["activate"];
        case "rejected":
          return ["approve"];
        default:
          return [];
      }
    },
    []
  );

  const availableActions = useMemo(() => {
    if (!driverProfile?.status) return [];
    return getAvailableActions(driverProfile.status);
  }, [driverProfile?.status, getAvailableActions]);

  return {
    driverProfile,
    isLoading,
    isFetching,
    isUpdating,
    error,
    handleDriverAction,
    refreshProfile,
    availableActions,
    driverId,
  };
};
