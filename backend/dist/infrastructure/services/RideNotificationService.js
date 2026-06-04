"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideNotificationService = void 0;
const inversify_1 = require("inversify");
const socket_1 = require("../realtime/socket");
const SocketEvents_1 = require("../realtime/constants/SocketEvents");
const Logger_1 = require("../../shared/utils/Logger");
const RedisPubSubClient_1 = require("../realtime/RedisPubSubClient");
const PubSubChannels_1 = require("@infrastructure/realtime/constants/PubSubChannels");
let RideNotificationService = class RideNotificationService {
    constructor() {
        this.redisPublisher = null;
        this.redisConnected = false;
    }
    tryGetSocketServer() {
        try {
            return (0, socket_1.getRideSocketServer)();
        }
        catch {
            return null;
        }
    }
    async getRedisPublisher() {
        if (this.redisConnected && this.redisPublisher) {
            return this.redisPublisher;
        }
        try {
            this.redisPublisher = (0, RedisPubSubClient_1.createRedisPubSubPublisher)();
            await this.redisPublisher.connect();
            this.redisConnected = true;
            return this.redisPublisher;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to connect Redis publisher", {
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }
    async publishToRedis(channel, payload) {
        try {
            const publisher = await this.getRedisPublisher();
            if (!publisher)
                return false;
            await publisher.publish(channel, JSON.stringify(payload));
            return true;
        }
        catch (error) {
            Logger_1.Logger.error("Redis publish failed", {
                channel,
                error: error instanceof Error ? error.message : String(error),
            });
            return false;
        }
    }
    async notifyDriverNewRequest(driverId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                // API process: emit directly
                io.to(`driver:${driverId}`).emit(SocketEvents_1.SOCKET_EVENTS.DRIVER_REQUEST_CREATED, payload);
                Logger_1.Logger.info("Notified driver of new request via socket", {
                    driverId,
                    requestId: payload.requestId,
                });
            }
            else {
                // Worker process: publish to Redis for API bridge to forward
                await this.publishToRedis(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_REQUEST_CREATED, {
                    driverId,
                    ...payload,
                });
                Logger_1.Logger.info("Published new ride request to Redis for bridge", {
                    driverId,
                    requestId: payload.requestId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of new request", {
                driverId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverRequestCancelled(driverId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverId}`).emit(SocketEvents_1.SOCKET_EVENTS.DRIVER_REQUEST_CANCELLED, payload);
            }
            Logger_1.Logger.info("Notified driver of cancelled request", { driverId });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of cancelled request", {
                driverId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderRideMatched(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_MATCHED, payload);
            }
            Logger_1.Logger.info("Notified rider of matched ride", {
                riderId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying rider of matched ride", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderNoDriverFound(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_NO_DRIVER_FOUND, payload);
                Logger_1.Logger.info("Notified rider of no driver found via socket", {
                    riderId,
                });
            }
            else {
                await this.publishToRedis(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND, {
                    riderId,
                    ...payload,
                });
                Logger_1.Logger.info("Published no driver found to Redis for bridge", {
                    riderId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying rider of no driver found", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderRideArrived(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_ARRIVED, payload);
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_ARRIVED, payload);
            }
            Logger_1.Logger.info("Notified ride arrived", { riderId, rideId: payload.rideId });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying ride arrived", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderRideStarted(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_STARTED, payload);
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_STARTED, payload);
            }
            Logger_1.Logger.info("Notified ride started", { riderId, rideId: payload.rideId });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying ride started", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRideCompleted(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_COMPLETED, payload);
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_COMPLETED, payload);
            }
            Logger_1.Logger.info("Notified ride completed", {
                riderId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying ride completed", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderRideCancelled(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_RIDER, payload);
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_RIDER, payload);
            }
            Logger_1.Logger.info("Notified rider of ride cancellation", {
                riderId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying rider of ride cancellation", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverRideCancelled(driverId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_DRIVER, payload);
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_DRIVER, payload);
            }
            Logger_1.Logger.info("Notified driver of ride cancellation", {
                driverId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of ride cancellation", {
                driverId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderRideCancelledByDriver(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_RIDER, payload);
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_RIDER, payload);
            }
            Logger_1.Logger.info("Notified rider of driver cancellation", {
                riderId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying rider of driver cancellation", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverRideCancelledConfirmation(driverUserId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER, payload);
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER, payload);
            }
            Logger_1.Logger.info("Sent driver cancellation confirmation", {
                driverUserId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error sending driver cancellation confirmation", {
                driverUserId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverFareUpdated(driverUserId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_FARE_RECALCULATED, payload);
                io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_FARE_RECALCULATED, payload);
            }
            Logger_1.Logger.info("Notified driver of fare update", { driverUserId });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of fare update", {
                driverUserId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderSearchProgress(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_SEARCH_PROGRESS_UPDATED, payload);
                Logger_1.Logger.info("Notified rider of ride search progress via socket", {
                    riderId,
                    requestGroupId: payload.requestGroupId,
                    status: payload.status,
                });
            }
            else {
                await this.publishToRedis(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS, {
                    riderId,
                    ...payload,
                });
                Logger_1.Logger.info("Published ride search progress to Redis for bridge", {
                    riderId,
                    requestGroupId: payload.requestGroupId,
                    status: payload.status,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying rider of ride search progress", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverNewFutureRequest(driverUserId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.FUTURE_RIDE_REQUEST_CREATED, payload);
                Logger_1.Logger.info("Notified driver of future ride request via socket", {
                    driverUserId,
                    futureRequestId: payload.requestId,
                    requestGroupId: payload.requestGroupId,
                });
            }
            else {
                await this.publishToRedis(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_REQUEST_CREATED, {
                    ...payload,
                });
                Logger_1.Logger.info("Published future ride request to Redis for bridge", {
                    driverUserId,
                    futureRequestId: payload.requestId,
                    requestGroupId: payload.requestGroupId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of future ride request", {
                driverUserId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyFutureRideAccepted(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.FUTURE_RIDE_ACCEPTED, payload);
            }
            Logger_1.Logger.info("Notified rider of future ride acceptance", {
                riderId,
                futureRequestId: payload.futureRequestId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying future ride acceptance", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyFutureRideExpired(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.FUTURE_RIDE_EXPIRED, payload);
            }
            Logger_1.Logger.info("Notified rider of future ride expiry", {
                riderId,
                requestGroupId: payload.requestGroupId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying future ride expiry", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverFutureRideExpired(driverUserId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.FUTURE_RIDE_REQUEST_EXPIRED, payload);
                Logger_1.Logger.info("Notified driver of future ride request expiry", {
                    driverUserId,
                    futureRequestId: payload.futureRequestId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of future ride expiry", {
                driverUserId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverFutureRideRequestCancelled(driverUserId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.FUTURE_RIDE_REQUEST_CANCELLED, payload);
                Logger_1.Logger.info("Notified driver of request cancelled", {
                    driverUserId,
                    futureRequestId: payload.futureRequestId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of request cancelled", {
                driverUserId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyDriverRideRequestExpired(driverUserId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_REQUEST_EXPIRED, payload);
                Logger_1.Logger.info("Notified driver of ride request expiry", {
                    driverUserId,
                    requestId: payload.requestId,
                });
            }
            else {
                await this.publishToRedis(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_REQUEST_EXPIRED, {
                    driverUserId,
                    ...payload,
                });
                Logger_1.Logger.info("Published ride request expiry to Redis for bridge", {
                    driverUserId,
                    requestId: payload.requestId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying driver of ride request expiry", {
                driverUserId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async notifyRiderFutureRideAllDriversRejected(riderId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (io) {
                io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.FUTURE_RIDE_ALL_DRIVERS_REJECTED, payload);
                Logger_1.Logger.info("Notified rider that all drivers rejected scheduled ride via socket", {
                    riderId,
                    requestGroupId: payload.requestGroupId,
                });
            }
            else {
                await this.publishToRedis(PubSubChannels_1.PUBSUB_CHANNELS.FUTURE_RIDE_ALL_DRIVERS_REJECTED, {
                    riderId,
                    ...payload,
                });
                Logger_1.Logger.info("Published all-drivers-rejected event to Redis for bridge", {
                    riderId,
                    requestGroupId: payload.requestGroupId,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying rider that all drivers rejected scheduled ride", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
};
exports.RideNotificationService = RideNotificationService;
exports.RideNotificationService = RideNotificationService = __decorate([
    (0, inversify_1.injectable)()
], RideNotificationService);
//# sourceMappingURL=RideNotificationService.js.map