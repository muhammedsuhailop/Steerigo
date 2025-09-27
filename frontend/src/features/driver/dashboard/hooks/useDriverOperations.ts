import { useCallback } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { DriverServiceContainer } from "../../shared/services/DriverServiceContainer";
import type { CurrentRide } from "../../shared/types/driver.types";

export const useDriverOperations = () => {
  const dispatch = useAppDispatch();

  // Initialize services
  const container = DriverServiceContainer.getInstance();
  try {
    container.getServices();
  } catch {
    container.initialize(dispatch);
  }
  const services = container.getServices();

  const toggleOnlineStatus = useCallback(
    async (isOnline: boolean) => {
      try {
        services.stateService.setLoading(true);
        await services.dataService.setDriverOnlineStatus(isOnline);
        services.stateService.setOnlineStatus(isOnline);

        const message = isOnline
          ? "You are now online and available for rides"
          : "You are now offline";
        services.notificationService.showSuccess(message);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update status";
        services.stateService.setError(errorMessage);
        services.notificationService.showError(errorMessage);
      } finally {
        services.stateService.setLoading(false);
      }
    },
    [services]
  );

  const acceptRideRequest = useCallback(
    async (requestId: string) => {
      try {
        services.stateService.setLoading(true);
        const currentRide = await services.dataService.acceptRideRequest(
          requestId
        );
        services.stateService.setCurrentRide(currentRide);

        // Remove from pending requests
        const updatedRequests = await services.dataService.getPendingRequests();
        services.stateService.setPendingRequests(updatedRequests);

        services.notificationService.showSuccess("Ride request accepted!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to accept ride";
        services.stateService.setError(errorMessage);
        services.notificationService.showError(errorMessage);
      } finally {
        services.stateService.setLoading(false);
      }
    },
    [services]
  );

  const rejectRideRequest = useCallback(
    async (requestId: string) => {
      try {
        services.stateService.setLoading(true);
        await services.dataService.rejectRideRequest(requestId);

        // Remove from pending requests
        const updatedRequests = await services.dataService.getPendingRequests();
        services.stateService.setPendingRequests(updatedRequests);

        services.notificationService.showInfo("Ride request rejected");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to reject ride";
        services.stateService.setError(errorMessage);
        services.notificationService.showError(errorMessage);
      } finally {
        services.stateService.setLoading(false);
      }
    },
    [services]
  );

  const updateRideStatus = useCallback(
    async (rideId: string, status: CurrentRide["status"]) => {
      try {
        services.stateService.setLoading(true);
        const updatedRide = await services.dataService.updateRideStatus(
          rideId,
          status
        );
        services.stateService.setCurrentRide(
          status === "completed" ? null : updatedRide
        );

        // Update stats if ride is completed
        if (status === "completed") {
          const stats = await services.dataService.getDriverStats();
          services.stateService.setStats(stats);
          services.notificationService.showSuccess(
            "Ride completed successfully!"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update ride status";
        services.stateService.setError(errorMessage);
        services.notificationService.showError(errorMessage);
      } finally {
        services.stateService.setLoading(false);
      }
    },
    [services]
  );

  const refreshData = useCallback(async () => {
    try {
      services.stateService.setLoading(true);
      services.stateService.clearError();

      const [driver, stats, pendingRequests, currentRide] = await Promise.all([
        services.dataService.getDriverProfile(),
        services.dataService.getDriverStats(),
        services.dataService.getPendingRequests(),
        services.dataService.getCurrentRide(),
      ]);

      services.stateService.setDriver(driver);
      services.stateService.setStats(stats);
      services.stateService.setPendingRequests(pendingRequests);
      services.stateService.setCurrentRide(currentRide);

      services.notificationService.showSuccess("Data refreshed successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to refresh data";
      services.stateService.setError(errorMessage);
      services.notificationService.showError(errorMessage);
    } finally {
      services.stateService.setLoading(false);
    }
  }, [services]);

  return {
    toggleOnlineStatus,
    acceptRideRequest,
    rejectRideRequest,
    updateRideStatus,
    refreshData,
  };
};
