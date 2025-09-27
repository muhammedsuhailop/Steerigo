import { AppDispatch } from "@/app/store";
import { DriverStateService } from "../types/driver.interfaces";
import type {
  Driver,
  DriverStats,
  RideRequest,
  CurrentRide,
} from "../types/driver.types";

import {
  setLoading,
  setError,
  setDriver,
  setStats,
  setPendingRequests,
  setCurrentRide,
  setOnlineStatus,
  clearError,
  clearDriverData,
} from "../store/driverSlice";

export class ReduxDriverStateService implements DriverStateService {
  constructor(private dispatch: AppDispatch) {}

  setLoading(loading: boolean): void {
    this.dispatch(setLoading(loading));
  }

  setError(error: string | null): void {
    this.dispatch(setError(error));
  }

  setDriver(driver: Driver): void {
    this.dispatch(setDriver(driver));
  }

  setStats(stats: DriverStats): void {
    this.dispatch(setStats(stats));
  }

  setPendingRequests(requests: RideRequest[]): void {
    this.dispatch(setPendingRequests(requests));
  }

  setCurrentRide(ride: CurrentRide | null): void {
    this.dispatch(setCurrentRide(ride));
  }

  setOnlineStatus(isOnline: boolean): void {
    this.dispatch(setOnlineStatus(isOnline));
  }

  clearError(): void {
    this.dispatch(clearError());
  }

  clearDriverData(): void {
    this.dispatch(clearDriverData());
  }
}
