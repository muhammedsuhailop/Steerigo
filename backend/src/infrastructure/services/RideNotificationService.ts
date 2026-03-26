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
} from "../../application/services/IRideNotificationService";
import { getRideSocketServer } from "../realtime/socket";
import { SOCKET_EVENTS } from "../realtime/constants/SocketEvents";
import { Logger } from "../../shared/utils/Logger";

@injectable()
export class RideNotificationService implements IRideNotificationService {
  async notifyDriverNewRequest(
    driverId: string,
    payload: DriverRequestNotificationPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`driver:${driverId}`).emit(
        SOCKET_EVENTS.DRIVER_REQUEST_CREATED,
        payload,
      );
      Logger.info("Notified driver of new request", {
        driverId,
        requestId: payload.requestId,
      });
    } catch (error) {
      Logger.error("Error notifying driver of new request", {
        driverId,
        error,
      });
    }
  }

  async notifyDriverRequestCancelled(
    driverId: string,
    payload: DriverRequestCancelledPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`driver:${driverId}`).emit(
        SOCKET_EVENTS.DRIVER_REQUEST_CANCELLED,
        payload,
      );
    } catch (error) {
      Logger.error("Error notifying driver of cancelled request", {
        driverId,
        payload,
        error,
      });
    }
  }

  async notifyRiderRideMatched(
    riderId: string,
    payload: RiderRideMatchedPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_MATCHED, payload);
      Logger.info("Notified rider of matched ride", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying rider of matched ride", { riderId, error });
    }
  }

  async notifyRiderNoDriverFound(
    riderId: string,
    payload: RiderNoDriverFoundPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`rider:${riderId}`).emit(
        SOCKET_EVENTS.RIDE_NO_DRIVER_FOUND,
        payload,
      );
    } catch (error) {
      Logger.error("Error notifying rider of no driver found", {
        riderId,
        error,
      });
    }
  }

  async notifyRiderRideArrived(
    riderId: string,
    payload: RideArrivedPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`ride:${payload.rideId}`).emit(SOCKET_EVENTS.RIDE_ARRIVED, payload);
      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_ARRIVED, payload);
      Logger.info("Notified ride arrived", { riderId, rideId: payload.rideId });
    } catch (error) {
      Logger.error("Error notifying ride arrived", {
        riderId,
        rideId: payload.rideId,
        error,
      });
    }
  }

  async notifyRiderRideStarted(
    riderId: string,
    payload: RideStartedPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`ride:${payload.rideId}`).emit(SOCKET_EVENTS.RIDE_STARTED, payload);
      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_STARTED, payload);
      Logger.info("Notified ride started", { riderId, rideId: payload.rideId });
    } catch (error) {
      Logger.error("Error notifying ride started", {
        riderId,
        rideId: payload.rideId,
        error,
      });
    }
  }

  async notifyRideCompleted(
    riderId: string,
    payload: RideCompletedPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.RIDE_COMPLETED,
        payload,
      );
      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.RIDE_COMPLETED, payload);
      Logger.info("Notified ride completed", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying ride completed", {
        riderId,
        rideId: payload.rideId,
        error,
      });
    }
  }

  async notifyRiderRideCancelled(
    riderId: string,
    payload: RideCancelledRiderPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`rider:${riderId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_RIDER,
        payload,
      );
      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_RIDER,
        payload,
      );
      Logger.info("Notified rider of ride cancellation", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying rider of ride cancellation", {
        riderId,
        rideId: payload.rideId,
        error,
      });
    }
  }

  async notifyDriverRideCancelled(
    driverId: string,
    payload: RideCancelledDriverPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`driver:${driverId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_DRIVER,
        payload,
      );
      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_DRIVER,
        payload,
      );
      Logger.info("Notified driver of ride cancellation", {
        driverId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying driver of ride cancellation", {
        driverId,
        rideId: payload.rideId,
        error,
      });
    }
  }

  async notifyRiderRideCancelledByDriver(
    riderId: string,
    payload: RideCancelledByDriverRiderPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`rider:${riderId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_RIDER,
        payload,
      );
      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_RIDER,
        payload,
      );
      Logger.info("Notified rider of driver cancellation", {
        riderId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying rider of driver cancellation", {
        riderId,
        rideId: payload.rideId,
        error,
      });
    }
  }

  async notifyDriverRideCancelledConfirmation(
    driverUserId: string,
    payload: RideCancelledByDriverDriverPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`driver:${driverUserId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER,
        payload,
      );
      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.RIDE_CANCELLED_BY_DRIVER_TO_DRIVER,
        payload,
      );
      Logger.info("Sent driver cancellation confirmation", {
        driverUserId,
        rideId: payload.rideId,
        penaltyDeducted: payload.penaltyDeducted,
      });
    } catch (error) {
      Logger.error("Error sending driver cancellation confirmation", {
        driverUserId,
        rideId: payload.rideId,
        error,
      });
    }
  }
}
