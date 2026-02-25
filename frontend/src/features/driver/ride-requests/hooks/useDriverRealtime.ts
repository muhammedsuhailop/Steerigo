import { useEffect } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";

interface RiderRealtimeProps {
  onMatched: (data: {
    rideId: string;
    driverId: string;
    status: string;
  }) => void;
  onNoDriver: (data: { requestGroupId: string; reason: string }) => void;
}

export const useRiderRealtime = ({
  onMatched,
  onNoDriver,
}: RiderRealtimeProps) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Use documented event names
    socket.on(SOCKET_EVENTS.RIDER.MATCHED, onMatched);
    socket.on(SOCKET_EVENTS.RIDER.NO_DRIVER, onNoDriver);

    return () => {
      socket.off(SOCKET_EVENTS.RIDER.MATCHED, onMatched);
      socket.off(SOCKET_EVENTS.RIDER.NO_DRIVER, onNoDriver);
    };
  }, [onMatched, onNoDriver]);
};
