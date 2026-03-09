import { Server as HttpServer } from "http";
import {
  Server as SocketIOServer,
  DefaultEventsMap,
  RemoteSocket,
} from "socket.io";
import { ITokenService } from "../../application/services/ITokenService";
import { Logger } from "../../shared/utils/Logger";
import { UserRole } from "../../shared/constants/AuthConstants";
import {
  DriverLocationUpdateDto,
  DriverLocationUpdatePayload,
} from "../../application/dto/driver/DriverLocationUpdateDto";
import { IDriverLocationRepository } from "../../domain/repositories/IDriverLocationRepository";
import { container } from "../container/DIContainer";
import { TYPES } from "../../shared/constants/DITypes";

export interface SocketData {
  userId: string;
  role: UserRole;
  accessToken: string;
}

interface SocketAuthPayload {
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
): SocketIOServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
> {
  if (ioInstance) {
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

  const driverLocationRepository = container.get<IDriverLocationRepository>(
    TYPES.DriverLocationRepository,
  );

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const { accessToken } = socket.handshake.auth as SocketAuthPayload;

      if (!accessToken) {
        Logger.warn("Socket connection attempt without access token", {
          socketId: socket.id,
        });
        return next(new Error("Unauthorized: Access token required"));
      }

      const payload = await tokenService.verifyAccessToken(accessToken);

      if (!payload) {
        Logger.warn("Socket connection with invalid access token", {
          socketId: socket.id,
        });
        return next(new Error("Unauthorized: Invalid or expired access token"));
      }

      const { userId, role } = payload;

      if (!userId || !role) {
        Logger.warn("Socket token missing required claims", {
          socketId: socket.id,
          hasUserId: !!userId,
          hasRole: !!role,
        });
        return next(new Error("Unauthorized: Invalid token payload"));
      }

      if (role !== UserRole.DRIVER && role !== UserRole.RIDER) {
        Logger.warn("Socket connection with invalid role", {
          socketId: socket.id,
          role,
        });
        return next(new Error("Unauthorized: Invalid role"));
      }

      socket.data.userId = userId;
      socket.data.role = role as UserRole;
      socket.data.accessToken = accessToken;

      Logger.info("Socket authenticated successfully", {
        socketId: socket.id,
        userId,
        role,
      });

      next();
    } catch (error) {
      Logger.error("Socket authentication error", { error });
      next(new Error("Unauthorized: Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, role } = socket.data;

    Logger.info("Client connected via Socket.IO", {
      socketId: socket.id,
      userId,
      role,
    });

    if (role === UserRole.DRIVER) {
      socket.join(`driver:${userId}`);
      Logger.info(`Driver joined room: driver:${userId}`, {
        socketId: socket.id,
        userId,
      });
    } else if (role === UserRole.RIDER) {
      socket.join(`rider:${userId}`);
      Logger.info(`Rider joined room: rider:${userId}`, {
        socketId: socket.id,
        userId,
      });
    }

    //Ride

    socket.on("ride:join", (rideId: string) => {
      if (!rideId) {
        return;
      }

      socket.join(`ride:${rideId}`);

      Logger.info("Socket joined ride room", {
        socketId: socket.id,
        userId,
        role,
        rideId,
      });
    });

    socket.on("ride:leave", (rideId: string) => {
      if (!rideId) {
        return;
      }

      socket.leave(`ride:${rideId}`);

      Logger.info("Socket left ride room", {
        socketId: socket.id,
        userId,
        role,
        rideId,
      });
    });

    // Driver real-time location updates

    let lastLocationSentAt = 0;
    const MIN_INTERVAL_MS = 3000; 

    socket.on(
      "driver:location:update",
      async (rawPayload: DriverLocationUpdatePayload) => {
        if (role !== UserRole.DRIVER) {
          Logger.warn("Non-driver attempted to send location update", {
            socketId: socket.id,
            userId,
            role,
          });
          return;
        }

        const now = Date.now();
        if (now - lastLocationSentAt < MIN_INTERVAL_MS) {
          return;
        }
        lastLocationSentAt = now;

        try {
          const dto = DriverLocationUpdateDto.fromSocket(userId, rawPayload);

          const coordinates = {
            latitude: dto.getLatitude(),
            longitude: dto.getLongitude(),
          };

          await driverLocationRepository.saveDriverLocation({
            driverUserId: dto.getDriverUserId(),
            coordinates,
            bearing: dto.getBearing(),
            speedKph: dto.getSpeedKph(),
            accuracy: dto.getAccuracy(),
            updatedAt: new Date(),
          });

          const rideId = dto.getRideId();

          const locationPayload = {
            driverId: userId,
            lat: dto.getLatitude(),
            lng: dto.getLongitude(),
            bearing: dto.getBearing(),
            speedKph: dto.getSpeedKph(),
            accuracy: dto.getAccuracy(),
            updatedAt: new Date().toISOString(),
            rideId: rideId ?? null,
          };

          io.to(`driver:${userId}`).emit("driver:location", locationPayload);

          if (rideId) {
            io.to(`ride:${rideId}`).emit(
              "ride:driver-location",
              locationPayload,
            );
          }

          Logger.debug("Driver location update processed", {
            driverId: userId,
            rideId,
            lat: dto.getLatitude(),
            lng: dto.getLongitude(),
          });
        } catch (error) {
          Logger.error("Error handling driver:location:update", {
            userId,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    );

    socket.on("disconnect", (reason) => {
      Logger.info("Client disconnected from Socket.IO", {
        socketId: socket.id,
        userId,
        role,
        reason,
      });
    });

    socket.on("auth:logout", () => {
      Logger.info("Client initiated logout", {
        socketId: socket.id,
        userId: socket.data.userId,
      });
      socket.disconnect(true);
    });
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

export async function disconnectAllSockets(): Promise<void> {
  if (ioInstance) {
    Logger.info("Disconnecting all Socket.IO clients");
    const sockets = await ioInstance.fetchSockets();
    sockets.forEach((socket) => socket.disconnect(true));
    ioInstance.close();
    ioInstance = null;
    Logger.info("All Socket.IO clients disconnected");
  }
}

export async function getSocketByUserId(
  userId: string,
): Promise<RemoteSocket<DefaultEventsMap, SocketData> | null> {
  if (!ioInstance) {
    return null;
  }

  const sockets = await ioInstance.fetchSockets();
  const socket = sockets.find((s) => s.data.userId === userId);
  return socket ?? null;
}
