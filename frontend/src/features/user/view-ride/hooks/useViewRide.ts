import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { updateRideStatusLocal } from "../store/viewRideSlice";
import { RideStatus } from "../types/viewRide.types";

export const useViewRide = (rideId: string | undefined) => {
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
        dispatch(updateRideStatusLocal(data.status));
      }
    };

    socket.on(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);
    };
  }, [rideId, dispatch]);
};
