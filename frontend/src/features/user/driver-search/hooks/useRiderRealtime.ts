import { useEffect, useState } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";

export const useRiderRealtime = ({
  onMatched,
  onNoDriver,
}: {
  onMatched: (data: any) => void;
  onNoDriver: (data: any) => void;
}) => {
  const [socketReady, setSocketReady] = useState(!!getSocket());

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.warn("[Socket] Socket not found. Retrying in 1s...");
      const interval = setInterval(() => {
        const s = getSocket();
        if (s) {
          console.log("🔌 [Socket] Socket detected! Initializing listeners...");
          setSocketReady(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    console.log("[Socket] Attaching Rider listeners. ID:", socket.id);

    const handleMatchedInternal = (data: any) => {
      console.log("[Socket] Event Received: ride:matched", data);
      onMatched(data);
    };

    const handleNoDriverInternal = (data: any) => {
      console.log("[Socket] Event Received: ride:no_driver", data);
      onNoDriver(data);
    };

    socket.on(SOCKET_EVENTS.RIDER.MATCHED, handleMatchedInternal);
    socket.on(SOCKET_EVENTS.RIDER.NO_DRIVER, handleNoDriverInternal);

    socket.on("connect", () => {
      console.log("[Socket] Reconnected. Listeners active.");
    });

    return () => {
      console.log("[Socket] Removing Rider listeners");
      socket.off(SOCKET_EVENTS.RIDER.MATCHED, handleMatchedInternal);
      socket.off(SOCKET_EVENTS.RIDER.NO_DRIVER, handleNoDriverInternal);
      socket.off("connect");
    };
  }, [socketReady]);
};
