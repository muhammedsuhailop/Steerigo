import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ViewRideState,
  RideDetails,
  DriverInfo,
  RideTimeline,
  FareDetails,
} from "../types/viewRide.types";
import { RideStatus } from "@/shared/types/ride.types";

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
    updateRideStatusLocal: (
      state,
      action: PayloadAction<{
        status: RideStatus;
        timestampField?: keyof RideTimeline;
        timestampValue?: string;
        fare?: FareDetails;
      }>,
    ) => {
      if (state.activeRide) {
        state.activeRide.status = action.payload.status;

        if (action.payload.timestampField && action.payload.timestampValue) {
          state.activeRide.timeline[action.payload.timestampField] =
            action.payload.timestampValue;
        }

        if (action.payload.fare) {
          state.activeRide.fare = action.payload.fare;
        }
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
