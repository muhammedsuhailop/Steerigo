import { injectable } from "inversify";
import {
  IRideNotificationService,
  DriverRequestNotificationPayload,
  DriverRequestCancelledPayload,
  RiderRideMatchedPayload,
  RiderNoDriverFoundPayload,
} from "../../application/services/IRideNotificationService";
import { getRideSocketServer } from "../realtime/socket";
import { Logger } from "../../shared/utils/Logger";

@injectable()
export class RideNotificationService implements IRideNotificationService {
  async notifyDriverNewRequest(
    driverId: string, // driver's userId
    payload: DriverRequestNotificationPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`driver:${driverId}`).emit("ride:request:created", payload);
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
      io.to(`driver:${driverId}`).emit("ride:request:cancelled", payload);
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
      io.to(`rider:${riderId}`).emit("ride:matched", payload);
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
      io.to(`rider:${riderId}`).emit("ride:no-driver-found", payload);
    } catch (error) {
      Logger.error("Error notifying rider of no driver found", {
        riderId,
        error,
      });
    }
  }
}
