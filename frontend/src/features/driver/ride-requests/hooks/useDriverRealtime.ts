import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { rideRequestsApi } from "../services/rideRequestsApi";

export const useDriverRealtime = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewRideRequest = () => {
      dispatch(
        rideRequestsApi.util.invalidateTags([
          { type: "RideRequests", id: "LIST" },
        ]),
      );
    };

    socket.on(SOCKET_EVENTS.DRIVER.NEW_REQUEST, onNewRideRequest);

    return () => {
      socket.off(SOCKET_EVENTS.DRIVER.NEW_REQUEST, onNewRideRequest);
    };
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewRideRequest = () => {
      dispatch(
        rideRequestsApi.util.invalidateTags([
          { type: "RideRequests", id: "LIST" },
        ]),
      );
    };

    const onNewFutureRideRequest = () => {
      dispatch(
        rideRequestsApi.util.invalidateTags([
          { type: "FutureRideRequests", id: "LIST" },
        ]),
      );
    };

    socket.on(SOCKET_EVENTS.DRIVER.NEW_REQUEST, onNewRideRequest);
    socket.on("ride:request:future:created", onNewFutureRideRequest);

    return () => {
      socket.off(SOCKET_EVENTS.DRIVER.NEW_REQUEST, onNewRideRequest);
      socket.off("ride:request:future:created", onNewFutureRideRequest);
    };
  }, [dispatch]);
};
