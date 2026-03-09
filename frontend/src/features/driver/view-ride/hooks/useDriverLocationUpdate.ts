import { useEffect } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { RideStatus } from "@/shared/types/ride.types";

export const useDriverLocationUpdate = (
  rideId: string | undefined,
  status: RideStatus | undefined,
) => {
  useEffect(() => {
    const isTrackingActive =
      status === "Accepted" || status === "Arrived" || status === "Started";
    if (!rideId || !isTrackingActive) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.RIDE.JOIN, rideId);

    const sendLocation = () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, heading, speed, accuracy } =
            position.coords;

          socket.emit(SOCKET_EVENTS.RIDE.UPDATE_LOCATION, {
            lat: latitude,
            lng: longitude,
            bearing: heading ?? 0,
            speedKph: (speed ?? 0) * 3.6,
            accuracy: Math.min(accuracy ?? 0, 2000),
            rideId,
            updatedAt: Date.now(),
          });
        },
        (err) => console.error("Location Error:", err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    };

    sendLocation();
    const interval = setInterval(sendLocation, 50000);

    return () => {
      clearInterval(interval);
      socket.emit(SOCKET_EVENTS.RIDE.LEAVE, rideId);
    };
  }, [rideId, status]);
};
