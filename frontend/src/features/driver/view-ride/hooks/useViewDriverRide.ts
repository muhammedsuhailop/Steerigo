import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import {
  updateDriverRideStatusLocal,
  updateDriverPaymentStatusLocal,
} from "../store/viewDriverRideSlice";
import {
  PaymentCashConfirmedPayload,
  PaymentFailedPayload,
  PaymentSucceededPayload,
  RideCancelledByDriverEventPayload,
  RideCancelledEventPayload,
  RideStatus,
} from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";

export const useViewDriverRide = (rideId: string | undefined) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!rideId) return;

    const socket = getSocket();
    if (!socket) return;

    const handleStatusUpdate = (data: {
      rideId: string;
      status: RideStatus;
    }) => {
      if (data.rideId === rideId) {
        dispatch(updateDriverRideStatusLocal(data.status));
      }
    };

    const onRiderCancelled = (data: RideCancelledEventPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(updateDriverRideStatusLocal(payload.status as RideStatus));
      }
    };

    const onDriverCancelledBySelf = (
      data: RideCancelledByDriverEventPayload,
    ) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(updateDriverRideStatusLocal(payload.status as RideStatus));
      }
    };

    const onPaymentSucceeded = (data: PaymentSucceededPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(
          updateDriverPaymentStatusLocal({
            status: PaymentStatus.SUCCESS,
            paidAt: payload.paidAt,
          }),
        );
      }
    };

    const onPaymentFailed = (data: PaymentFailedPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(
          updateDriverPaymentStatusLocal({
            status: PaymentStatus.FAILED,
            reason: payload.reason,
          }),
        );
      }
    };

    const onCashConfirmed = (data: PaymentCashConfirmedPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(
          updateDriverPaymentStatusLocal({
            status: PaymentStatus.SUCCESS,
            paidAt: payload.paidAt,
          }),
        );
      }
    };

    // Binding Listeners
    socket.on(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);
    socket.on(SOCKET_EVENTS.RIDE.RIDE_CANCELLED_RIDER, onRiderCancelled);
    socket.on(
      SOCKET_EVENTS.RIDE.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER,
      onDriverCancelledBySelf,
    );

    socket.on(SOCKET_EVENTS.PAYMENT.PAYMENT_COMPLETED, onPaymentSucceeded);
    socket.on(SOCKET_EVENTS.PAYMENT.PAYMENT_FAILED, onPaymentFailed);
    socket.on(SOCKET_EVENTS.PAYMENT.PAYMENT_CASH_CONFIRMED, onCashConfirmed);

    return () => {
      // Cleanup Listeners
      socket.off(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);
      socket.off(SOCKET_EVENTS.RIDE.RIDE_CANCELLED_RIDER, onRiderCancelled);
      socket.off(
        SOCKET_EVENTS.RIDE.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER,
        onDriverCancelledBySelf,
      );

      socket.off(SOCKET_EVENTS.PAYMENT.PAYMENT_COMPLETED, onPaymentSucceeded);
      socket.off(SOCKET_EVENTS.PAYMENT.PAYMENT_FAILED, onPaymentFailed);
      socket.off(SOCKET_EVENTS.PAYMENT.PAYMENT_CASH_CONFIRMED, onCashConfirmed);
    };
  }, [rideId, dispatch]);
};
