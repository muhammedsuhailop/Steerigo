import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const createSocket = (auth: {
  userId: string;
  role: "rider" | "driver";
  driverId?: string;
}) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth,
    reconnection: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => socket?.disconnect();
