import type {
  Driver,
  RideRequest,
  CurrentRide,
  DriverStats,
} from "./driver.types";

// Data Service Interface
export interface DriverDataService {
  getDriverProfile(): Promise<Driver>;
  updateDriverProfile(updates: Partial<Driver>): Promise<Driver>;
  getDriverStats(): Promise<DriverStats>;
  getPendingRequests(): Promise<RideRequest[]>;
  getCurrentRide(): Promise<CurrentRide | null>;
  acceptRideRequest(requestId: string): Promise<CurrentRide>;
  rejectRideRequest(requestId: string): Promise<void>;
  updateRideStatus(
    rideId: string,
    status: CurrentRide["status"]
  ): Promise<CurrentRide>;
  setDriverOnlineStatus(isOnline: boolean): Promise<void>;
  updateDriverLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<void>;
}

// State Service Interface
export interface DriverStateService {
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
  setDriver(driver: Driver): void;
  setStats(stats: DriverStats): void;
  setPendingRequests(requests: RideRequest[]): void;
  setCurrentRide(ride: CurrentRide | null): void;
  setOnlineStatus(isOnline: boolean): void;
  clearError(): void;
  clearDriverData(): void;
}

// Notification Service Interface
export interface DriverNotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showInfo(message: string): void;
  showRideRequest(request: RideRequest): void;
  playNotificationSound(): void;
}

// Location Service Interface
export interface DriverLocationService {
  getCurrentLocation(): Promise<{ latitude: number; longitude: number }>;
  watchLocation(
    callback: (location: { latitude: number; longitude: number }) => void
  ): number;
  clearLocationWatch(watchId: number): void;
  calculateDistance(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): number;
  calculateETA(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): number;
}
