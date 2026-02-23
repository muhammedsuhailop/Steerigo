import { injectable } from "inversify";
import {
  IRideNotificationService,
  DriverRequestNotificationPayload,
  RiderRideMatchedPayload,
  RiderNoDriverFoundPayload,
} from "@application/services/IRideNotificationService";
import { getRideSocketServer } from "@infrastructure/realtime/socket";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RideNotificationService implements IRideNotificationService {
  async notifyDriverNewRequest(
    driverId: string,
    payload: DriverRequestNotificationPayload,
  ): Promise<void> {
    try {
      Logger.info("RideNotificationService instance", {
        instanceId: this,
      });
      const io = getRideSocketServer();
      io.to(`driver:${driverId}`).emit("ride_request:created", payload);
    } catch (error) {
      Logger.error("Error notifying driver of new request", {
        driverId,
        error,
      });
    }
  }

  async notifyDriverRequestCancelled(
    driverId: string,
    requestId: string,
    requestGroupId: string,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`driver:${driverId}`).emit("ride_request:cancelled", {
        requestId,
        requestGroupId,
      });
    } catch (error) {
      Logger.error("Error notifying driver of cancelled request", {
        driverId,
        requestId,
        requestGroupId,
        error,
      });
    }
  }

  async notifyRiderRideMatched(
    riderId: string,
    payload: RiderRideMatchedPayload,
  ): Promise<void> {
    try {
      Logger.info("RideNotificationService instance", {
        instanceId: this,
      });
      const io = getRideSocketServer();
      io.to(`rider:${riderId}`).emit("ride:matched", payload);
    } catch (error) {
      Logger.error("Error notifying rider of matched ride", {
        riderId,
        error,
      });
    }
  }

  async notifyRiderNoDriverFound(
    riderId: string,
    payload: RiderNoDriverFoundPayload,
  ): Promise<void> {
    try {
      const io = getRideSocketServer();
      io.to(`rider:${riderId}`).emit("ride:no_driver_found", payload);
    } catch (error) {
      Logger.error("Error notifying rider of no driver found", {
        riderId,
        error,
      });
    }
  }
}
