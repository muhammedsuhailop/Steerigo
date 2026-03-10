import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { updateDriverRideStatusLocal } from "../store/viewDriverRideSlice";
import { RideStatus } from "@/shared/types/ride.types";

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

    socket.on(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);
    };
  }, [rideId, dispatch]);
};
