import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Driver,
  DriverStats,
  RideRequest,
  CurrentRide,
  DriverState,
} from "../types/driver.types";

const initialState: DriverState = {
  driver: null,
  stats: null,
  pendingRequests: [],
  currentRide: null,
  isLoading: false,
  error: null,
  isOnline: false,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.isLoading = false;
      }
    },
    setDriver: (state, action: PayloadAction<Driver>) => {
      state.driver = action.payload;
      state.isOnline = action.payload.currentStatus !== "Offline";
    },
    setStats: (state, action: PayloadAction<DriverStats>) => {
      state.stats = action.payload;
    },
    setPendingRequests: (state, action: PayloadAction<RideRequest[]>) => {
      state.pendingRequests = action.payload;
    },
    setCurrentRide: (state, action: PayloadAction<CurrentRide | null>) => {
      state.currentRide = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      if (state.driver) {
        state.driver.currentStatus = action.payload ? "Available" : "Offline";
      }
    },
    addPendingRequest: (state, action: PayloadAction<RideRequest>) => {
      state.pendingRequests.unshift(action.payload);
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(
        (req) => req.id !== action.payload
      );
    },
    updateRideStatus: (
      state,
      action: PayloadAction<{ rideId: string; status: CurrentRide["status"] }>
    ) => {
      if (state.currentRide && state.currentRide.id === action.payload.rideId) {
        state.currentRide.status = action.payload.status;

        if (
          action.payload.status === "completed" &&
          state.driver &&
          state.stats
        ) {
          // Update stats when ride is completed
          state.stats.completedRides += 1;
          state.stats.todayEarnings += state.currentRide.fare;
          state.driver.completedRides += 1;
          state.driver.todayEarnings += state.currentRide.fare;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDriverData: () => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setError,
  setDriver,
  setStats,
  setPendingRequests,
  setCurrentRide,
  setOnlineStatus,
  addPendingRequest,
  removePendingRequest,
  updateRideStatus,
  clearError,
  clearDriverData,
} = driverSlice.actions;

export default driverSlice.reducer;

// Selectors
export const selectDriver = (state: { driver: DriverState }) =>
  state.driver.driver;
export const selectDriverStats = (state: { driver: DriverState }) =>
  state.driver.stats;
export const selectPendingRequests = (state: { driver: DriverState }) =>
  state.driver.pendingRequests;
export const selectCurrentRide = (state: { driver: DriverState }) =>
  state.driver.currentRide;
export const selectIsOnline = (state: { driver: DriverState }) =>
  state.driver.isOnline;
export const selectDriverLoading = (state: { driver: DriverState }) =>
  state.driver.isLoading;
export const selectDriverError = (state: { driver: DriverState }) =>
  state.driver.error;
