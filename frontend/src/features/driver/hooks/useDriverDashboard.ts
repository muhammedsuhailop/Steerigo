import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/store/hooks";
import { DriverServiceContainer } from "../services/DriverServiceContainer";
import type { RootState } from "@/app/store";

export const useDriverDashboard = () => {
  const dispatch = useAppDispatch();
  const driverState = useSelector((state: RootState) => state.driver);

  // Initialize services
  const container = DriverServiceContainer.getInstance();
  try {
    container.getServices();
  } catch {
    container.initialize(dispatch);
  }
  const services = container.getServices();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        services.stateService.setLoading(true);

        const [driver, stats, pendingRequests, currentRide] = await Promise.all(
          [
            services.dataService.getDriverProfile(),
            services.dataService.getDriverStats(),
            services.dataService.getPendingRequests(),
            services.dataService.getCurrentRide(),
          ]
        );

        services.stateService.setDriver(driver);
        services.stateService.setStats(stats);
        services.stateService.setPendingRequests(pendingRequests);
        services.stateService.setCurrentRide(currentRide);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data";
        services.stateService.setError(errorMessage);
      } finally {
        services.stateService.setLoading(false);
      }
    };

    loadInitialData();
  }, [services]);

  // Poll for new requests when online
  useEffect(() => {
    if (!driverState.isOnline) return;

    const pollInterval = setInterval(async () => {
      try {
        const requests = await services.dataService.getPendingRequests();
        const currentRequests = driverState.pendingRequests;

        // Check for new requests
        const newRequests = requests.filter(
          (req) => !currentRequests.find((current) => current.id === req.id)
        );

        if (newRequests.length > 0) {
          services.stateService.setPendingRequests(requests);
          newRequests.forEach((req) => {
            services.notificationService.showRideRequest(req);
          });
        }
      } catch (error) {
        console.error("Failed to poll for requests:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [driverState.isOnline, driverState.pendingRequests, services]);

  return {
    ...driverState,
    services,
  };
};
