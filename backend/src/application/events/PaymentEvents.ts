export interface BasePaymentEvent<TType extends string, TPayload> {
  type: TType;
  occurredAt: Date;
  payload: TPayload;
}

export interface PaymentInitiatedPayload {
  paymentId: string;
  rideId: string;
  riderId: string;
  amount: number;
  currency: string;
  method: string;
}

export type PaymentInitiatedEvent = BasePaymentEvent<
  "PaymentInitiated",
  PaymentInitiatedPayload
>;

export interface PaymentSucceededPayload {
  paymentId: string;
  rideId: string;
  driverId: string;
  driverUserId: string;
  riderId: string;
  amount: number;
  currency: string;
  paidAt: string;
}

export type PaymentSucceededEvent = BasePaymentEvent<
  "PaymentSucceeded",
  PaymentSucceededPayload
>;

export interface PaymentFailedPayload {
  paymentId: string;
  rideId: string;
  driverUserId: string;
  riderId: string;
  reason?: string;
  failedAt: string;
}

export type PaymentFailedEvent = BasePaymentEvent<
  "PaymentFailed",
  PaymentFailedPayload
>;

export interface PaymentCashConfirmedPayload {
  paymentId: string;
  rideId: string;
  driverId: string;
  driverUserId: string;
  riderId: string;
  amount: number;
  currency: string;
  paidAt: string;
}

export type PaymentCashConfirmedEvent = BasePaymentEvent<
  "PaymentCashConfirmed",
  PaymentCashConfirmedPayload
>;

export type PaymentDomainEvent =
  | PaymentInitiatedEvent
  | PaymentSucceededEvent
  | PaymentFailedEvent
  | PaymentCashConfirmedEvent;
