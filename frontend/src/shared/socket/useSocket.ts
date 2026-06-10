import { useEffect, useRef, useState } from "react";
import { createSocket, disconnectSocket, updateSocketAuth } from "./socket";

type UseSocketAuth = {
  accessToken: string | null;
};

export const useSocket = ({ accessToken }: UseSocketAuth) => {
  const [isSocketReady, setIsSocketReady] = useState(false);
  const hasConnectedRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      console.warn("USE SOCKET - NO TOKEN -> DISCONNECT");

      disconnectSocket();

      setIsSocketReady(false);
      hasConnectedRef.current = false;
      lastTokenRef.current = null;

      return;
    }

    if (!hasConnectedRef.current) {
      const socket = createSocket(accessToken);

      hasConnectedRef.current = true;
      lastTokenRef.current = accessToken;

      if (!socket) return;

      const handleConnect = () => {
        setIsSocketReady(true);
      };

      const handleDisconnect = () => {
        setIsSocketReady(false);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      if (socket.connected) {
        setIsSocketReady(true);
      }

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }

    if (lastTokenRef.current !== accessToken) {
      updateSocketAuth(accessToken);
      lastTokenRef.current = accessToken;
    }
  }, [accessToken]);

  return isSocketReady;
};
