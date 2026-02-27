import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ViewRideState,
  RideDetails,
  DriverInfo,
  RideStatus,
} from "../types/viewRide.types";

const initialState: ViewRideState = {
  activeRide: null,
  activeDriver: null,
  isLoading: false,
  error: null,
};

export const viewRideSlice = createSlice({
  name: "viewRide",
  initialState,
  reducers: {
    setRideData: (
      state,
      action: PayloadAction<{ ride: RideDetails; driver: DriverInfo | null }>,
    ) => {
      state.activeRide = action.payload.ride;
      state.activeDriver = action.payload.driver;
    },
    updateRideStatusLocal: (state, action: PayloadAction<RideStatus>) => {
      if (state.activeRide) {
        state.activeRide.status = action.payload;
      }
    },
    clearRideData: (state) => {
      state.activeRide = null;
      state.activeDriver = null;
    },
  },
});

export const { setRideData, updateRideStatusLocal, clearRideData } =
  viewRideSlice.actions;

export const selectActiveRide = (state: { viewRide: ViewRideState }) =>
  state.viewRide.activeRide;
export const selectActiveDriver = (state: { viewRide: ViewRideState }) =>
  state.viewRide.activeDriver;

export default viewRideSlice.reducer;
