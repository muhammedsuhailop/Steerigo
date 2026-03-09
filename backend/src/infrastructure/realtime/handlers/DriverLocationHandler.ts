import { Server, Socket } from "socket.io";
import { Logger } from "../../../shared/utils/Logger";
import { UserRole } from "../../../shared/constants/AuthConstants";
import {
  DriverLocationUpdateDto,
  DriverLocationUpdatePayload,
} from "../../../application/dto/driver/DriverLocationUpdateDto";
import { IDriverLocationRepository } from "../../../domain/repositories/IDriverLocationRepository";
import { SOCKET_EVENTS } from "../constants/SocketEvents";

const rateLimitMap = new Map<string, number>();
const MIN_INTERVAL_MS = 3000;

export function registerDriverLocationHandler(
  io: Server,
  socket: Socket,
  repository: IDriverLocationRepository,
) {
  socket.on(
    SOCKET_EVENTS.DRIVER_LOCATION_UPDATE,
    async (rawPayload: DriverLocationUpdatePayload) => {
      const { userId, role } = socket.data;

      if (role !== UserRole.DRIVER) {
        Logger.warn("Non-driver attempted location update", {
          socketId: socket.id,
          userId,
        });
        return;
      }

      const now = Date.now();
      const last = rateLimitMap.get(userId) ?? 0;

      if (now - last < MIN_INTERVAL_MS) return;

      rateLimitMap.set(userId, now);

      try {
        const dto = DriverLocationUpdateDto.fromSocket(userId, rawPayload);

        const coordinates = {
          latitude: dto.getLatitude(),
          longitude: dto.getLongitude(),
        };

        await repository.saveDriverLocation({
          driverUserId: dto.getDriverUserId(),
          coordinates,
          bearing: dto.getBearing(),
          speedKph: dto.getSpeedKph(),
          accuracy: dto.getAccuracy(),
          updatedAt: new Date(),
        });

        const rideId = dto.getRideId();

        const payload = {
          driverId: userId,
          lat: dto.getLatitude(),
          lng: dto.getLongitude(),
          bearing: dto.getBearing(),
          speedKph: dto.getSpeedKph(),
          accuracy: dto.getAccuracy(),
          updatedAt: new Date().toISOString(),
          rideId: rideId ?? null,
        };

        io.to(`driver:${userId}`).emit(SOCKET_EVENTS.DRIVER_LOCATION, payload);

        if (rideId) {
          io.to(`ride:${rideId}`).emit(
            SOCKET_EVENTS.RIDE_DRIVER_LOCATION,
            payload,
          );
        }

        Logger.debug("Driver location processed", {
          driverId: userId,
          rideId,
        });
      } catch (error) {
        Logger.error("Driver location handler error", {
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
  );
}
