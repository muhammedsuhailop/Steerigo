import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket, DefaultEventsMap } from "socket.io";

export type ClientRole = "driver" | "rider";

export interface SocketData {
  userId: string;
  role: ClientRole;
  driverId?: string;
}

let ioInstance: SocketIOServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
> | null = null;

export function initializeRideSocketServer(
  httpServer: HttpServer,
  corsOrigins: string[],
): SocketIOServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
> {
  if (ioInstance) {
    return ioInstance;
  }

  const io = new SocketIOServer<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
  >(httpServer, {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const { userId, role, driverId } = socket.handshake.auth as {
      userId?: string;
      role?: ClientRole;
      driverId?: string;
    };

    if (!userId || !role) {
      return next(new Error("Unauthorized: userId and role are required"));
    }

    socket.data.userId = userId;
    socket.data.role = role;
    if (role === "driver" && driverId) {
      socket.data.driverId = driverId;
    }

    next();
  });

  io.on("connection", (socket) => {
    const { userId, role, driverId } = socket.data;

    if (role === "driver" && driverId) {
      socket.join(`driver:${driverId}`);
    } else if (role === "rider") {
      socket.join(`rider:${userId}`);
    }
  });

  ioInstance = io;
  return io;
}

export function getRideSocketServer(): SocketIOServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
> {
  if (!ioInstance) {
    throw new Error("Ride Socket.IO server has not been initialized");
  }

  return ioInstance;
}
