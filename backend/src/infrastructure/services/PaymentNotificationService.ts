import { injectable } from "inversify";
import { getRideSocketServer } from "../realtime/socket";
import { Logger } from "@shared/utils/Logger";
import { SOCKET_EVENTS } from "@infrastructure/realtime/constants/SocketEvents";

@injectable()
export class PaymentNotificationService {
  async notifyPaymentInitiated(
    riderId: string,
    payload: {
      paymentId: string;
      rideId: string;
      amount: number;
      currency: string;
      method: string;
    },
  ): Promise<void> {
    try {
      const io = getRideSocketServer();

      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.PAYMENT_INITIATED, payload);

      Logger.info("Notified payment initiated", {
        riderId,
        paymentId: payload.paymentId,
      });
    } catch (error) {
      Logger.error("Error notifying payment initiated", {
        riderId,
        error,
      });
    }
  }

  async notifyPaymentSucceeded(
    riderId: string,
    driverId: string,
    driverUserId: string,
    payload: {
      paymentId: string;
      rideId: string;
      amount: number;
      currency: string;
      paidAt: string;
    },
  ): Promise<void> {
    try {
      const io = getRideSocketServer();

      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.PAYMENT_COMPLETED, payload);

      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.PAYMENT_COMPLETED,
        payload,
      );

      io.to(`driver:${driverUserId}`).emit(
        SOCKET_EVENTS.PAYMENT_COMPLETED,
        payload,
      );

      Logger.info("Notified payment success", {
        riderId,
        paymentId: payload.paymentId,
      });
    } catch (error) {
      Logger.error("Error notifying payment success", {
        riderId,
        error,
      });
    }
  }

  async notifyPaymentFailed(
    riderId: string,
    driverUserId: string,
    payload: {
      paymentId: string;
      rideId: string;
      reason?: string;
      failedAt: string;
    },
  ): Promise<void> {
    try {
      const io = getRideSocketServer();

      io.to(`rider:${riderId}`).emit(SOCKET_EVENTS.PAYMENT_FAILED, payload);

      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.PAYMENT_FAILED,
        payload,
      );

      io.to(`driver:${driverUserId}`).emit(
        SOCKET_EVENTS.PAYMENT_FAILED,
        payload,
      );

      Logger.warn("Notified payment failed", {
        riderId,
        paymentId: payload.paymentId,
        reason: payload.reason,
      });
    } catch (error) {
      Logger.error("Error notifying payment failed", {
        riderId,
        error,
      });
    }
  }

  async notifyPaymentCashConfirmed(
    driverId: string,
    payload: {
      paymentId: string;
      rideId: string;
      riderId: string;
      amount: number;
      currency: string;
      paidAt: string;
    },
  ): Promise<void> {
    try {
      const io = getRideSocketServer();

      io.to(`driver:${driverId}`).emit(
        SOCKET_EVENTS.PAYMENT_CASH_CONFIRMED,
        payload,
      );

      io.to(`rider:${payload.riderId}`).emit(
        SOCKET_EVENTS.PAYMENT_COMPLETED,
        payload,
      );

      io.to(`ride:${payload.rideId}`).emit(
        SOCKET_EVENTS.PAYMENT_COMPLETED,
        payload,
      );

      Logger.info("Notified cash payment confirmed to driver and ride room", {
        driverId,
        rideId: payload.rideId,
      });
    } catch (error) {
      Logger.error("Error notifying cash payment confirmed", {
        driverId,
        error,
      });
    }
  }
}
