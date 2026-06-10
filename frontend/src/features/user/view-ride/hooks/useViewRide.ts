import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import {
  updateRideStatusLocal,
  updatePaymentStatusLocal,
} from "../store/viewRideSlice";
import {
  RideArrivedPayload,
  RideStartedPayload,
  RideCompletedPayload,
  RideStatus,
  PaymentSucceededPayload,
  PaymentFailedPayload,
  RideCancelledEventPayload,
  RideCancelledByDriverEventPayload,
} from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import { FareDetails, LocationUpdatePayload } from "../types/viewRide.types";

export const useViewRide = (
  rideId: string | undefined,
  socketReady: boolean,
) => {
  const dispatch = useDispatch();
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    bearing: number;
  } | null>(null);

  useEffect(() => {
    if (!rideId) return;

    if (!socketReady) {
      console.log("Waiting for socket...");
      return;
    }

    const socket = getSocket();

    if (!socket) {
      console.warn("Socket unavailable");
      return;
    }

    const joinRoom = () => {
      socket.emit(SOCKET_EVENTS.RIDE.JOIN, rideId);
    };

    joinRoom();

    socket.on("connect", joinRoom);

    const onArrived = (data: RideArrivedPayload) => {
      try {
        const payload = Array.isArray(data) ? data[0] : data;

        if (payload.rideId === rideId) {
          dispatch(
            updateRideStatusLocal({
              status: payload.status,
              timestampField: "arrivedAt",
              timestampValue: payload.arrivedAt,
            }),
          );
        } else {
          console.warn("ARRIVED ignored - Ride ID mismatch");
        }
      } catch (error) {
        console.error("ARRIVED HANDLER ERROR", error);
      }
    };

    const onStarted = (data: RideStartedPayload) => {
      try {
        const payload = Array.isArray(data) ? data[0] : data;

        if (payload.rideId === rideId) {
          dispatch(
            updateRideStatusLocal({
              status: payload.status,
              timestampField: "startedAt",
              timestampValue: payload.startedAt,
            }),
          );
        } else {
          console.warn("STARTED ignored - Ride ID mismatch");
        }

        console.groupEnd();
      } catch (error) {
        console.error("STARTED HANDLER ERROR", error);
      }
    };

    const onCompleted = (data: RideCompletedPayload) => {
      try {
        const payload = Array.isArray(data) ? data[0] : data;

        if (payload.rideId === rideId) {
          const mappedFare: FareDetails = {
            baseFare: payload.fareBreakdown?.baseFare?.amount ?? 0,
            tax: {
              total:
                (payload.fareBreakdown?.taxes?.fare?.amount?.amount ?? 0) +
                (payload.fareBreakdown?.taxes?.platformFee?.amount?.amount ??
                  0),
            },
            platformFee: payload.fareBreakdown?.platformFee?.amount ?? 0,
            totalFare: payload.fareBreakdown?.totalFare?.amount ?? 0,
            currency: payload.fareBreakdown?.totalFare?.currency ?? "INR",
            payableAmount: payload.payableAmount ?? 0,
          };

          dispatch(
            updateRideStatusLocal({
              status: payload.status as RideStatus,
              timestampField: "completedAt",
              timestampValue: payload.completedAt,
              fare: mappedFare,
            }),
          );
        } else {
          console.warn("COMPLETED ignored - Ride ID mismatch");
        }

        console.groupEnd();
      } catch (error) {
        console.error("COMPLETED HANDLER ERROR", error);
      }
    };

    const onRiderCancelled = (data: RideCancelledEventPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;

      if (payload.rideId === rideId) {
        dispatch(
          updateRideStatusLocal({
            status: payload.status as RideStatus,
            timestampField: "cancelledAt",
            timestampValue: payload.cancelledAt,
          }),
        );
      }
    };

    const onDriverCancelled = (data: RideCancelledByDriverEventPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;

      if (payload.rideId === rideId) {
        dispatch(
          updateRideStatusLocal({
            status: RideStatus.CANCELLED,
            timestampField: "cancelledAt",
            timestampValue: payload.cancelledAt,
          }),
        );
      }
    };

    const onPaymentSucceeded = (data: PaymentSucceededPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(
          updatePaymentStatusLocal({
            paymentStatus: PaymentStatus.SUCCESS,
            paymentCompletedAt: payload.paidAt,
          }),
        );
      }
    };

    const onPaymentFailed = (data: PaymentFailedPayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        dispatch(
          updatePaymentStatusLocal({
            paymentStatus: PaymentStatus.FAILED,
          }),
        );
      }
    };

    const handleLocationUpdate = (data: LocationUpdatePayload) => {
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload.rideId === rideId) {
        setDriverLocation({
          lat: payload.lat,
          lng: payload.lng,
          bearing: payload.bearing || 0,
        });
      }
    };

    // Binding events
    socket.on(SOCKET_EVENTS.RIDE.ARRIVED, onArrived);
    socket.on(SOCKET_EVENTS.RIDE.STARTED, onStarted);
    socket.on(SOCKET_EVENTS.RIDE.COMPLETED, onCompleted);
    socket.on(SOCKET_EVENTS.RIDE.DRIVER_LOCATION, handleLocationUpdate);
    socket.on(SOCKET_EVENTS.RIDE.RIDE_CANCELLED_RIDER, onRiderCancelled);
    socket.on(
      SOCKET_EVENTS.RIDE.RIDE_CANCELLED_BY_DRIVER_TO_RIDER,
      onDriverCancelled,
    );

    socket.on(SOCKET_EVENTS.PAYMENT.PAYMENT_COMPLETED, onPaymentSucceeded);
    socket.on(SOCKET_EVENTS.PAYMENT.PAYMENT_FAILED, onPaymentFailed);

    return () => {
      socket.off("connect", joinRoom);
      socket.emit(SOCKET_EVENTS.RIDE.LEAVE, rideId);
      socket.off(SOCKET_EVENTS.RIDE.ARRIVED, onArrived);
      socket.off(SOCKET_EVENTS.RIDE.STARTED, onStarted);
      socket.off(SOCKET_EVENTS.RIDE.COMPLETED, onCompleted);
      socket.off(SOCKET_EVENTS.RIDE.DRIVER_LOCATION, handleLocationUpdate);
      socket.off(SOCKET_EVENTS.RIDE.RIDE_CANCELLED_RIDER, onRiderCancelled);
      socket.off(
        SOCKET_EVENTS.RIDE.RIDE_CANCELLED_BY_DRIVER_TO_RIDER,
        onDriverCancelled,
      );

      socket.off(SOCKET_EVENTS.PAYMENT.PAYMENT_COMPLETED, onPaymentSucceeded);
      socket.off(SOCKET_EVENTS.PAYMENT.PAYMENT_FAILED, onPaymentFailed);
    };
  }, [rideId, socketReady, dispatch]);

  return { driverLocation };
};
