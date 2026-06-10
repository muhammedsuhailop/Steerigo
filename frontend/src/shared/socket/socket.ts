import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const DEBUG = import.meta.env.VITE_SOCKET_DEBUG === "true";

const log = (...args: unknown[]) => {
  if (DEBUG) {
    console.log("[SOCKET]", ...args);
  }
};

const errorLog = (...args: unknown[]) => {
  if (DEBUG) {
    console.error("[SOCKET]", ...args);
  }
};

declare global {
  interface Window {
    socket?: Socket;
  }
}

export const createSocket = (accessToken: string) => {
  if (!accessToken) {
    log("Socket not created - missing access token");
    return;
  }

  if (socket) {
    log("Destroying existing socket", socket.id);
    socket.removeAllListeners();
    socket.disconnect();
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || "/";

  socket = io(socketUrl, {
    auth: { accessToken },
    transports: ["websocket"],
    reconnection: true,
    autoConnect: true,
  });

  if (DEBUG) {
    window.socket = socket;
  }

  socket.on("connect_error", (err) => {
    errorLog("Connect Error");
    errorLog("Message", err.message);
  });

  socket.io.on("reconnect_attempt", (attempt) => {
    log("Reconnect Attempt", attempt);
  });

  socket.io.on("reconnect", (attempt) => {
    log("Reconnected After Attempt", attempt);
    log("Socket ID", socket?.id);
  });

  socket.io.on("error", (err) => {
    errorLog("Manager Error", err);
  });

  socket.io.on("close", (reason) => {
    log("Manager Closed", reason);
  });

  if (DEBUG) {
    socket.onAny((event, ...args) => {
      console.group(`[SOCKET EVENT] ${event}`);
      console.log("Time", new Date().toISOString());
      console.log("Socket ID", socket?.id);
      console.log("Payload", args);
      console.groupEnd();
    });

    socket.onAnyOutgoing((event, ...args) => {
      console.group(`[SOCKET OUTGOING] ${event}`);
      console.log("Time", new Date().toISOString());
      console.log("Socket ID", socket?.id);
      console.log("Payload", args);
      console.groupEnd();
    });
  }

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
