import { Server as HttpServer } from "http";
import {
  Server as SocketIOServer,
  DefaultEventsMap,
  RemoteSocket,
} from "socket.io";
import { ITokenService } from "../../application/services/ITokenService";
import { Logger } from "../../shared/utils/Logger";
import { UserRole } from "../../shared/constants/AuthConstants";
import { IDriverLocationRepository } from "../../domain/repositories/IDriverLocationRepository";
import { container } from "../container/DIContainer";
import { TYPES } from "../../shared/constants/DITypes";
import { createSocketAuthMiddleware } from "./middleware/SocketAuthMiddleware";
import { registerRideRoomHandlers } from "./handlers/RideRoomHandler";
import { registerDriverLocationHandler } from "./handlers/DriverLocationHandler";
import { SOCKET_EVENTS } from "./constants/SocketEvents";

export interface SocketData {
  userId: string;
  role: UserRole;
  accessToken: string;
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
  tokenService: ITokenService,
) {
  if (ioInstance) {
    Logger.warn("Socket.IO already initialized. Returning existing instance.");
    return ioInstance;
  }

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...corsOrigins.filter(Boolean),
  ].filter(Boolean) as string[];

  const io = new SocketIOServer<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
  >(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  Logger.info("Socket.IO server initialized", {
    allowedOrigins,
  });

  const driverLocationRepository = container.get<IDriverLocationRepository>(
    TYPES.DriverLocationRepository,
  );

  io.use(createSocketAuthMiddleware(tokenService));

  Logger.info("Socket authentication middleware registered");

  io.on("connection", (socket) => {
    const { userId, role } = socket.data;

    Logger.info("Socket connected", {
      socketId: socket.id,
      userId,
      role,
    });

    const userRoom = `user:${userId}`;
    socket.join(userRoom);

    Logger.info("User joined unified room", {
      socketId: socket.id,
      userId,
      room: userRoom,
    });

    if (role === UserRole.DRIVER) {
      const room = `driver:${userId}`;
      socket.join(room);

      Logger.info("Driver joined socket room", {
        socketId: socket.id,
        userId,
        room,
      });
    }

    if (role === UserRole.RIDER) {
      const room = `rider:${userId}`;
      socket.join(room);

      Logger.info("Rider joined socket room", {
        socketId: socket.id,
        userId,
        room,
      });
    }

    registerRideRoomHandlers(socket);

    Logger.debug("Ride room handlers registered", {
      socketId: socket.id,
      userId,
    });

    registerDriverLocationHandler(io, socket, driverLocationRepository);

    Logger.debug("Driver location handler registered", {
      socketId: socket.id,
      userId,
    });

    socket.on("disconnect", (reason) => {
      Logger.info("Socket disconnected", {
        socketId: socket.id,
        userId,
        role,
        reason,
      });
    });

    socket.on(SOCKET_EVENTS.AUTH_LOGOUT, () => {
      Logger.info("Client requested logout", {
        socketId: socket.id,
        userId,
      });

      socket.disconnect(true);
    });
  });

  ioInstance = io;

  Logger.info("Socket.IO connection listener registered");

  return io;
}

export function getRideSocketServer() {
  if (!ioInstance) {
    Logger.error("Attempted to access Socket.IO before initialization");
    throw new Error("Ride Socket.IO server not initialized");
  }

  return ioInstance;
}

export async function disconnectAllSockets(): Promise<void> {
  if (!ioInstance) return;

  Logger.info("Disconnecting all active sockets");

  const sockets = await ioInstance.fetchSockets();

  Logger.info("Total sockets to disconnect", {
    count: sockets.length,
  });

  sockets.forEach((socket) => socket.disconnect(true));

  ioInstance.close();
  ioInstance = null;

  Logger.info("All sockets disconnected and Socket.IO server closed");
}

export async function getSocketByUserId(
  userId: string,
): Promise<RemoteSocket<DefaultEventsMap, SocketData> | null> {
  if (!ioInstance) {
    Logger.warn("Socket lookup attempted before initialization", { userId });
    return null;
  }

  Logger.debug("Searching socket for user", { userId });

  const sockets = await ioInstance.fetchSockets();

  const socket = sockets.find((s) => s.data.userId === userId) ?? null;

  if (!socket) {
    Logger.debug("No active socket found for user", { userId });
  } else {
    Logger.debug("Socket found for user", {
      userId,
      socketId: socket.id,
    });
  }

  return socket;
}
