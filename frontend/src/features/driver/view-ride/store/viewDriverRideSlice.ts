import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RideStatus } from "../../../user/view-ride/types/viewRide.types";
import {
  DriverRideDetails,
  RiderInfo,
  ViewDriverRideState,
} from "../viewDriverRide.types";

const initialState: ViewDriverRideState = {
  activeRide: null,
  activeRider: null,
  isLoading: false,
  error: null,
};

export const viewDriverRideSlice = createSlice({
  name: "viewDriverRide",
  initialState,
  reducers: {
    setDriverRideData: (
      state,
      action: PayloadAction<{ ride: DriverRideDetails; rider: RiderInfo }>,
    ) => {
      state.activeRide = action.payload.ride;
      state.activeRider = action.payload.rider;
    },
    updateDriverRideStatusLocal: (state, action: PayloadAction<RideStatus>) => {
      if (state.activeRide) {
        state.activeRide.status = action.payload;
      }
    },
    clearDriverRideData: (state) => {
      state.activeRide = null;
      state.activeRider = null;
    },
  },
});

export const {
  setDriverRideData,
  updateDriverRideStatusLocal,
  clearDriverRideData,
} = viewDriverRideSlice.actions;

export const selectActiveDriverRide = (state: {
  viewDriverRide: ViewDriverRideState;
}) => state.viewDriverRide.activeRide;
export const selectActiveRider = (state: {
  viewDriverRide: ViewDriverRideState;
}) => state.viewDriverRide.activeRider;

export default viewDriverRideSlice.reducer;
