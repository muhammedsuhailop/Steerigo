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
    driverId:string,
    payload: PaymentSucceededPayload,
  ): Promise<void>;

  notifyPaymentFailed(
    riderId: string,
    payload: PaymentFailedPayload,
  ): Promise<void>;

  notifyPaymentCashConfirmed(
    driverId: string,
    payload: PaymentCashConfirmedPayload,
  ): Promise<void>;
}
