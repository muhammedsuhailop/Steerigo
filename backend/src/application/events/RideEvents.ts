import {
  DriverRequestNotificationPayload,
  RideFareBreakdownJson,
} from "@application/services/IRideNotificationService";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";
import { RideCancellationReason } from "@domain/value-objects/RideCancellationReason";

export interface BaseRideEvent<TType extends string, TPayload> {
  type: TType;
  occurredAt: Date;
  payload: TPayload;
}

export interface RideMatchedEventPayload {
  riderId: string;
  rideId: string;
  driverId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  pickupTime: string;
  rideType: string;
  status: string;
  currency: string;
  fare: {
    amount: number;
    currency: string;
  };
}

export interface RideRequestCreatedPayload
  extends DriverRequestNotificationPayload {
  driverId: string;
}

export type RideRequestCreatedEvent = BaseRideEvent<
  "RideRequestCreated",
  RideRequestCreatedPayload
>;

export interface RideMatchedEvent
  extends BaseRideEvent<"RideMatched", RideMatchedEventPayload> {}

export interface RideRequestGroupExhaustedPayload {
  requestGroupId: string;
  riderId: string;
  reason: string;
}

export type RideRequestGroupExhaustedEvent = BaseRideEvent<
  "RideRequestGroupExhausted",
  RideRequestGroupExhaustedPayload
>;

export interface RideArrivedEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: string;
  arrivedAt: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideStartedEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: string;
  arrivedAt: string;
  startedAt: string;
  wasArrivedAutoSet: boolean;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideCompletedEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: string;
  arrivedAt?: string;
  startedAt: string;
  completedAt: string;
  fareBreakdown: RideFareBreakdownJson;
  payableAmount: number;
}

export interface RideCancelledEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  driverUserId: string;
  status: string;
  reason: RideCancellationReason;
  cancellationFeeAmount: number;
  cancellationFeeCurrency: string;
  cancelledAt: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideCancelledByDriverEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  driverUserId: string;
  status: string;
  reason: DriverCancellationReason;
  riderChargeAmount: number;
  riderChargeCurrency: string;
  driverPenaltyAmount: number;
  driverPenaltyCurrency: string;
  penaltyDeducted: boolean;
  cancelledAt: string;
  pickup: { latitude: number; longitude: number; address?: string };
  drop: { latitude: number; longitude: number; address?: string };
}

export interface RideFareUpdatedEventPayload {
  rideId: string;
  driverUserId: string;
  driverId: string;
  discountAmount: number;
  payableAmount: number;
  totalFare: number;
  currency: string;
  couponCode?: string;
  couponType?: CouponDiscountType;
}

export type RideCancelledByDriverEvent = BaseRideEvent<
  "RideCancelledByDriver",
  RideCancelledByDriverEventPayload
>;

export type RideArrivedEvent = BaseRideEvent<
  "RideArrived",
  RideArrivedEventPayload
>;
export type RideStartedEvent = BaseRideEvent<
  "RideStarted",
  RideStartedEventPayload
>;
export type RideCompletedEvent = BaseRideEvent<
  "RideCompleted",
  RideCompletedEventPayload
>;

export type RideCancelledEvent = BaseRideEvent<
  "RideCancelled",
  RideCancelledEventPayload
>;

export type RideFareUpdatedEvent = BaseRideEvent<
  "RideFareUpdated",
  RideFareUpdatedEventPayload
>;

export type RideDomainEvent =
  | RideRequestCreatedEvent
  | RideMatchedEvent
  | RideRequestGroupExhaustedEvent
  | RideArrivedEvent
  | RideStartedEvent
  | RideCompletedEvent
  | RideCancelledEvent
  | RideCancelledByDriverEvent
  | RideFareUpdatedEvent;
