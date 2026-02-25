import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const createSocket = (accessToken: string) => {
  if (!accessToken) {
    console.warn("Socket not created: no access token");
    return;
  }

  if (socket) socket.disconnect();

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { accessToken },
    transports: ["websocket"],
    reconnection: true,
    autoConnect: true,
  });

  return socket;
};

export const updateSocketAuth = (accessToken: string) => {
  if (!socket) return;

  socket.auth = {
    ...socket.auth,
    accessToken,
  };

  socket.disconnect();
  socket.connect();
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
