import { useEffect, useRef } from "react";
import { createSocket, disconnectSocket } from "./socket";

type AuthSocketParams = {
  userId?: string;
  role?: "rider" | "driver";
  driverId?: string;
};

export const useSocket = (auth: AuthSocketParams) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!auth.userId || !auth.role) return;

    if (initializedRef.current) return;

    createSocket({
      userId: auth.userId,
      role: auth.role,
      driverId: auth.driverId,
    });

    initializedRef.current = true;
  }, [auth.userId, auth.role, auth.driverId]);

  useEffect(() => {
    if (!auth.userId) {
      disconnectSocket();
      initializedRef.current = false;
    }
  }, [auth.userId]);
};