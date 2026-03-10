import { useEffect, useRef } from "react";
import { createSocket, disconnectSocket, updateSocketAuth } from "./socket";

type UseSocketAuth = {
  accessToken: string | null;
};

export const useSocket = ({ accessToken }: UseSocketAuth) => {
  const hasConnectedRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      hasConnectedRef.current = false;
      lastTokenRef.current = null;
      return;
    }

    if (!hasConnectedRef.current) {
      createSocket(accessToken);
      hasConnectedRef.current = true;
      lastTokenRef.current = accessToken;
      return;
    }

    if (lastTokenRef.current !== accessToken) {
      updateSocketAuth(accessToken);
      lastTokenRef.current = accessToken;
    }
  }, [accessToken]);
};
