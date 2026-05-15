import { useEffect, useState } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import type {
  FutureRideRequestCancelledSocketPayload,
  FutureRideRequestExpiredSocketPayload,
  PendingRideRequestData,
  FutureRideRequestData,
  RideRequestExpiredSocketPayload,
} from "../types/rideRequests.types";

interface Props {
  onNewRideRequest?: (request: PendingRideRequestData) => void;

  onNewFutureRideRequest?: (request: FutureRideRequestData) => void;
}

export const useDriverRealtime = ({
  onNewRideRequest,
  onNewFutureRideRequest,
}: Props = {}) => {
  const [expiredRequestIds, setExpiredRequestIds] = useState<Set<string>>(
    new Set(),
  );

  const [unavailableRequestIds, setUnavailableRequestIds] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const markUnavailable = (futureRequestId: string) => {
      setUnavailableRequestIds((prev) => {
        const next = new Set(prev);

        next.add(futureRequestId);

        return next;
      });
    };

    const onRideRequestCreated = (payload: PendingRideRequestData) => {
      onNewRideRequest?.(payload);
    };

    const onFutureRideRequestCreated = (payload: FutureRideRequestData) => {
      onNewFutureRideRequest?.(payload);
    };

    const onFutureRideCancelled = (
      payload: FutureRideRequestCancelledSocketPayload,
    ) => {
      markUnavailable(payload.futureRequestId);
    };

    const onRideRequestExpired = (payload: RideRequestExpiredSocketPayload) => {
      setExpiredRequestIds((prev) => new Set(prev).add(payload.requestId));
    };

    const onFutureRideExpired = (
      payload: FutureRideRequestExpiredSocketPayload,
    ) => {
      markUnavailable(payload.futureRequestId);
    };

    socket.on(SOCKET_EVENTS.DRIVER.NEW_REQUEST, onRideRequestCreated);

    socket.on(SOCKET_EVENTS.DRIVER.REQUEST_EXPIRED, onRideRequestExpired);

    socket.on(
      SOCKET_EVENTS.DRIVER.FUTURE_RIDE_REQUEST_CREATED,
      onFutureRideRequestCreated,
    );

    socket.on(
      SOCKET_EVENTS.DRIVER.FUTURE_RIDE_REQUEST_CANCELLED,
      onFutureRideCancelled,
    );

    socket.on(
      SOCKET_EVENTS.DRIVER.FUTURE_RIDE_REQUEST_EXPIRED,
      onFutureRideExpired,
    );

    return () => {
      socket.off(SOCKET_EVENTS.DRIVER.NEW_REQUEST, onRideRequestCreated);

      socket.off(SOCKET_EVENTS.DRIVER.REQUEST_EXPIRED, onRideRequestExpired);

      socket.off(
        SOCKET_EVENTS.DRIVER.FUTURE_RIDE_REQUEST_CREATED,
        onFutureRideRequestCreated,
      );

      socket.off(
        SOCKET_EVENTS.DRIVER.FUTURE_RIDE_REQUEST_CANCELLED,
        onFutureRideCancelled,
      );

      socket.off(
        SOCKET_EVENTS.DRIVER.FUTURE_RIDE_REQUEST_EXPIRED,
        onFutureRideExpired,
      );
    };
  }, [onNewRideRequest, onNewFutureRideRequest]);

  return {
    unavailableRequestIds,
    expiredRequestIds,
  };
};
