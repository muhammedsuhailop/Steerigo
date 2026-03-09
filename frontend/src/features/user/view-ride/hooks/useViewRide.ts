import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { updateRideStatusLocal } from "../store/viewRideSlice";
import { RideStatus } from "../types/viewRide.types";

export const useViewRide = (rideId: string | undefined) => {
  const dispatch = useDispatch();
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    bearing: number;
  } | null>(null);

  useEffect(() => {
    if (!rideId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.RIDE.JOIN, rideId);

    const handleStatusUpdate = (data: {
      rideId: string;
      status: RideStatus;
    }) => {
      if (data.rideId === rideId) {
        dispatch(updateRideStatusLocal(data.status));
      }
    };

    const handleLocationUpdate = (data: any) => {
      if (data.rideId === rideId) {
        setDriverLocation({
          lat: data.lat,
          lng: data.lng,
          bearing: data.bearing || 0,
        });
      }
    };

    socket.on(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);
    socket.on(SOCKET_EVENTS.RIDE.DRIVER_LOCATION, handleLocationUpdate);

    return () => {
      socket.emit(SOCKET_EVENTS.RIDE.LEAVE, rideId);
      socket.off(SOCKET_EVENTS.RIDE.STATUS_UPDATED, handleStatusUpdate);
      socket.off(SOCKET_EVENTS.RIDE.DRIVER_LOCATION, handleLocationUpdate);
    };
  }, [rideId, dispatch]);

  return { driverLocation };
};
