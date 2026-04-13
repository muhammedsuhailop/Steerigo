import { injectable } from "inversify";
import {
  IRideNotificationService,
  DriverRequestNotificationPayload,
  DriverRequestCancelledPayload,
  RiderRideMatchedPayload,
  RiderNoDriverFoundPayload,
  RideArrivedPayload,
  RideStartedPayload,
  RideCompletedPayload,
  RideCancelledDriverPayload,
  RideCancelledRiderPayload,
  RideCancelledByDriverRiderPayload,
  RideCancelledByDriverDriverPayload,
  DriverFareUpdatedPayload,
} from "../../application/services/IRideNotificationService";
import { getRideSocketServer } from "../realtime/socket";
import { SOCKET_EVENTS } from "../realtime/constants/SocketEvents";
import { Logger } from "../../shared/utils/Logger";
import { createRedisPubSubPublisher } from "../realtime/RedisPubSubClient";
import { RedisClientType } from "redis";
import { PUBSUB_CHANNELS } from "@infrastructure/realtime/constants/PubSubChannels";

@injectable()
export class RideNotificationService implements IRideNotificationService {
  private redisPublisher: RedisClientType | null = null;
  private redisConnected = false;

  private tryGetSocketServer() {
    try {
      return getRideSocketServer();
    } catch {
      return null;
    }
  }

  private async getRedisPublisher(): Promise<RedisClientType | null> {
    if (this.redisConnected && this.redisPublisher) {
      return this.redisPublisher;
    }
    try {
      this.redisPublisher = createRedisPubSubPublisher();
      await this.redisPublisher.connect();
      this.redisConnected = true;
      return this.redisPublisher;
    } catch (error) {
      Logger.error("Failed to connect Redis publisher", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  private async publishToRedis(
    channel: string,
    payload: object,
  ): Promise<boolean> {
    try {
      const publisher = await this.getRedisPublisher();
      if (!publisher) return false;
      await publisher.publish(channel, JSON.stringify(payload));
      return true;
    } catch (error) {
      Logger.error("Redis publish failed", {
        channel,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async notifyDriverNewRequest(
    driverId: string,
    payload: DriverRequestNotificationPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();

      if (io) {
        // API process: emit directly
        io.to(`driver:${driverId}`).emit(
          SOCKET_EVENTS.DRIVER_REQUEST_CREATED,
          payload,
        );
        Logger.info("Notified driver of new request via socket", {
          driverId,
          requestId: payload.requestId,
        });
      } else {
        // Worker process: publish to Redis for API bridge to forward
        await this.publishToRedis(PUBSUB_CHANNELS.RIDE_REQUEST_CREATED, {
          driverId,
          ...payload,
        });
        Logger.info("Published new ride request to Redis for bridge", {
          driverId,
          requestId: payload.requestId,
        });
      }
    } catch (error) {
      Logger.error("Error notifying driver of new request", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyDriverRequestCancelled(
    driverId: string,
    payload: DriverRequestCancelledPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`driver:${driverId}`).emit(
          SOCKET_EVENTS.DRIVER_REQUEST_CANCELLED,
          payload,
        );
      }
      Logger.info("Notified driver of cancelled request", { driverId });
    } catch (error) {
      Logger.error("Error notifying driver of cancelled request", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderRideMatched(
    riderId: string,
    payload: RiderRideMatchedPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_MATCHED, payload);
      }
      Logger.info("Notified rider of matched ride", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying rider of matched ride", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderNoDriverFound(
    riderId: string,
    payload: RiderNoDriverFoundPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`rider:${riderId}`).emit(
          SOCKET_EVENTS.RIDE_NO_DRIVER_FOUND,
          payload,
        );
        Logger.info("Notified rider of no driver found via socket", {
          riderId,
        });
      } else {
        await this.publishToRedis(PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND, {
          riderId,
          ...payload,
        });
        Logger.info("Published no driver found to Redis for bridge", {
          riderId,
        });
      }
    } catch (error) {
      Logger.error("Error notifying rider of no driver found", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderRideArrived(
    riderId: string,
    payload: RideArrivedPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_ARRIVED,
          payload,
        );
        io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_ARRIVED, payload);
      }
      Logger.info("Notified ride arrived", { riderId, rideId: payload.rideId });
    } catch (error) {
      Logger.error("Error notifying ride arrived", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderRideStarted(
    riderId: string,
    payload: RideStartedPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_STARTED,
          payload,
        );
        io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_STARTED, payload);
      }
      Logger.info("Notified ride started", { riderId, rideId: payload.rideId });
    } catch (error) {
      Logger.error("Error notifying ride started", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRideCompleted(
    riderId: string,
    payload: RideCompletedPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_COMPLETED,
          payload,
        );
        io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_COMPLETED, payload);
      }
      Logger.info("Notified ride completed", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying ride completed", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderRideCancelled(
    riderId: string,
    payload: RideCancelledRiderPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`rider:${riderId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_RIDER,
          payload,
        );
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_RIDER,
          payload,
        );
      }
      Logger.info("Notified rider of ride cancellation", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying rider of ride cancellation", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyDriverRideCancelled(
    driverId: string,
    payload: RideCancelledDriverPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`driver:${driverId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_DRIVER,
          payload,
        );
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_DRIVER,
          payload,
        );
      }
      Logger.info("Notified driver of ride cancellation", {
        driverId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying driver of ride cancellation", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderRideCancelledByDriver(
    riderId: string,
    payload: RideCancelledByDriverRiderPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`rider:${riderId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_RIDER,
          payload,
        );
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_RIDER,
          payload,
        );
      }
      Logger.info("Notified rider of driver cancellation", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying rider of driver cancellation", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyDriverRideCancelledConfirmation(
    driverUserId: string,
    payload: RideCancelledByDriverDriverPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`driver:${driverUserId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER,
          payload,
        );
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER,
          payload,
        );
      }
      Logger.info("Sent driver cancellation confirmation", {
        driverUserId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error sending driver cancellation confirmation", {
        driverUserId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyDriverFareUpdated(
    driverUserId: string,
    payload: DriverFareUpdatedPayload,
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();
      if (io) {
        io.to(`driver:${driverUserId}`).emit(
          SOCKET_EVENTS.RIDE_FARE_RECALCULATED,
          payload,
        );
        io.to(`ride:${payload.rideId}`).emit(
          SOCKET_EVENTS.RIDE_FARE_RECALCULATED,
          payload,
        );
      }
      Logger.info("Notified driver of fare update", { driverUserId });
    } catch (error) {
      Logger.error("Error notifying driver of fare update", {
        driverUserId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async notifyRiderSearchProgress(
    riderId: string,
    payload: {
      requestGroupId: string;
      currentIndex: number;
      totalCandidates: number;
      message: string;
      status: "SEARCHING" | "COMPLETED" | "EXPIRED";
    },
  ): Promise<void> {
    try {
      const io = this.tryGetSocketServer();

      if (io) {
        io.to(`rider:${riderId}`).emit(
          SOCKET_EVENTS.RIDE_SEARCH_PROGRESS_UPDATED,
          payload,
        );
        Logger.info("Notified rider of ride search progress via socket", {
          riderId,
          requestGroupId: payload.requestGroupId,
          status: payload.status,
        });
      } else {
        await this.publishToRedis(PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS, {
          riderId,
          ...payload,
        });
        Logger.info("Published ride search progress to Redis for bridge", {
          riderId,
          requestGroupId: payload.requestGroupId,
          status: payload.status,
        });
      }
    } catch (error) {
      Logger.error("Error notifying rider of ride search progress", {
        riderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
