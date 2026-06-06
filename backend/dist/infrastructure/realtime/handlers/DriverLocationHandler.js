"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriverLocationHandler = registerDriverLocationHandler;
const Logger_1 = require("../../../shared/utils/Logger");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const DriverLocationUpdateDto_1 = require("../../../application/dto/driver/DriverLocationUpdateDto");
const SocketEvents_1 = require("../constants/SocketEvents");
const rateLimitMap = new Map();
const MIN_INTERVAL_MS = 3000;
function registerDriverLocationHandler(io, socket, repository) {
    socket.on(SocketEvents_1.SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, async (rawPayload) => {
        const { userId, role } = socket.data;
        if (role !== AuthConstants_1.UserRole.DRIVER) {
            Logger_1.Logger.warn("Non-driver attempted location update", {
                socketId: socket.id,
                userId,
            });
            return;
        }
        const now = Date.now();
        const last = rateLimitMap.get(userId) ?? 0;
        if (now - last < MIN_INTERVAL_MS)
            return;
        rateLimitMap.set(userId, now);
        try {
            const dto = DriverLocationUpdateDto_1.DriverLocationUpdateDto.fromSocket(userId, rawPayload);
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
            io.to(`driver:${userId}`).emit(SocketEvents_1.SOCKET_EVENTS.DRIVER_LOCATION, payload);
            if (rideId) {
                io.to(`ride:${rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_DRIVER_LOCATION, payload);
            }
            Logger_1.Logger.debug("Driver location processed", {
                driverId: userId,
                rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Driver location handler error", {
                userId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });
}
//# sourceMappingURL=DriverLocationHandler.js.map