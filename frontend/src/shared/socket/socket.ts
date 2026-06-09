import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const DEBUG = import.meta.env.VITE_SOCKET_DEBUG === "true";

const log = (...args: unknown[]) => {
  if (DEBUG) console.log(...args);
};

const errorLog = (...args: unknown[]) => {
  if (DEBUG) console.error(...args);
};

declare global {
  interface Window {
    socket?: Socket;
  }
}

export const createSocket = (accessToken: string) => {
  if (!accessToken) {
    log("Socket not created: no access token");
    return;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || "/";

  // socket = io("/", {
  socket = io(socketUrl, {
    auth: { accessToken },
    transports: ["websocket"],
    reconnection: true,
    autoConnect: true,
  });

  if (DEBUG) {
    window.socket = socket;
  }

  socket.on("connect", () => {
    log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    errorLog("Socket connection error:", err.message);
  });

  socket.io.on("reconnect_attempt", (attempt) => {
    log("Reconnect attempt:", attempt);
  });

  socket.io.on("reconnect", (attempt) => {
    log("Reconnected after:", attempt);
  });

  return socket;
};

export const updateSocketAuth = (accessToken: string) => {
  if (!socket) return;

  socket.auth = {
    ...socket.auth,
    accessToken,
  };

  socket.connect();
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
