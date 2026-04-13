import { useEffect, useState } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import {
  SearchProgressUpdate,
  RideMatchData,
} from "../types/driverSearch.types";

interface RiderRealtimeOptions {
  onMatched: (data: RideMatchData) => void;
  onProgress: (data: SearchProgressUpdate) => void;
  onNoDriver: () => void;
}

export const useRiderRealtime = ({
  onMatched,
  onProgress,
  onNoDriver,
}: RiderRealtimeOptions) => {
  const [socketReady, setSocketReady] = useState(!!getSocket());

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      const interval = setInterval(() => {
        const s = getSocket();
        if (s) {
          setSocketReady(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    const handleMatchedInternal = (data: RideMatchData) => onMatched(data);
    const handleProgressInternal = (data: SearchProgressUpdate) =>
      onProgress(data);
    const handleNoDriverInternal = () => onNoDriver();

    socket.on(SOCKET_EVENTS.RIDER.MATCHED, handleMatchedInternal);
    socket.on(
      SOCKET_EVENTS.RIDE.RIDE_SEARCH_PROGRESS_UPDATED,
      handleProgressInternal,
    );
    socket.on(SOCKET_EVENTS.RIDER.NO_DRIVER, handleNoDriverInternal);

    return () => {
      socket.off(SOCKET_EVENTS.RIDER.MATCHED, handleMatchedInternal);
      socket.off(
        SOCKET_EVENTS.RIDE.RIDE_SEARCH_PROGRESS_UPDATED,
        handleProgressInternal,
      );
      socket.off(SOCKET_EVENTS.RIDER.NO_DRIVER, handleNoDriverInternal);
    };
  }, [socketReady, onMatched, onProgress, onNoDriver]);
};
