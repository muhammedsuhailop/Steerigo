import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DriverRideDetails,
  RiderInfo,
  ViewDriverRideState,
} from "../types/viewDriverRide.types";
import { RideStatus } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";

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
    updateDriverPaymentStatusLocal: (
      state,
      action: PayloadAction<{
        status: PaymentStatus;
        paidAt?: string;
        reason?: string;
      }>,
    ) => {
      if (state.activeRide) {
        state.activeRide.paymentStatus = action.payload.status;
        if (action.payload.paidAt) {
          state.activeRide.timeline.paymentCompletedAt = action.payload.paidAt;
        }
      }
    },

    updateDriverRideFareLocal: (
      state,
      action: PayloadAction<{
        payableAmount: number;
        discountAmount: number;
        couponCode: string;
        couponType: string;
      }>,
    ) => {
      if (state.activeRide) {
        state.activeRide.fare.payableAmount = action.payload.payableAmount;

        state.activeRide.couponDetails = {
          couponCode: action.payload.couponCode,
          discountAmount: action.payload.discountAmount,
          discountType: action.payload.couponType,
        };
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
  updateDriverPaymentStatusLocal,
  updateDriverRideFareLocal,
  clearDriverRideData,
} = viewDriverRideSlice.actions;

export const selectActiveDriverRide = (state: {
  viewDriverRide: ViewDriverRideState;
}) => state.viewDriverRide.activeRide;
export const selectActiveRider = (state: {
  viewDriverRide: ViewDriverRideState;
}) => state.viewDriverRide.activeRider;

export default viewDriverRideSlice.reducer;
