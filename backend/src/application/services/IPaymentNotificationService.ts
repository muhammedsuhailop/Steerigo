import {
  PaymentCashConfirmedPayload,
  PaymentFailedPayload,
  PaymentInitiatedPayload,
  PaymentSucceededPayload,
} from "@application/events/PaymentEvents";

export interface IPaymentNotificationService {
  notifyPaymentInitiated(
    riderId: string,
    payload: PaymentInitiatedPayload,
  ): Promise<void>;

  notifyPaymentSucceeded(
    riderId: string,
    driverId: string,
    driverUserId: string,
    payload: PaymentSucceededPayload,
  ): Promise<void>;

  notifyPaymentFailed(
    riderId: string,
    driverUserId: string,
    payload: PaymentFailedPayload,
  ): Promise<void>;

  notifyPaymentCashConfirmed(
    driverId: string,
    payload: PaymentCashConfirmedPayload,
  ): Promise<void>;
}
